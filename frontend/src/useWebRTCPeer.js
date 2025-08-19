import { useEffect, useRef, useState, useCallback } from "react";
import { socket } from "./socket.js";

// Use public STUN; add TURN later for reliability
const rtcConfig = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
};

export default function useWebRTCPeer(roomId) {
  const pcRef = useRef(null);
  const channelRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [role, setRole] = useState(null); // "offerer" or "answerer"

  // Append incoming message
  const pushMessage = useCallback((msg, from = "peer") => {
    setMessages((m) => [...m, { id: crypto.randomUUID(), from, text: msg }]);
  }, []);

  // Setup listeners once
  useEffect(() => {
    socket.connect();

    // Join the room
    socket.emit("join-room", roomId, (res) => {
      if (!res?.ok) {
        alert(res?.reason === "room_full" ? "Room is full" : "Join failed");
        return;
      }
      // If peers=0 => first one in; will create offer
      // If peers=1 => second peer => will wait for offer, then answer
      setRole(res.peers === 0 ? "offerer" : "answerer");
      if (res.peers === 0) createOfferFlow();
    });

    function ensurePC() {
      if (!pcRef.current) {
        pcRef.current = new RTCPeerConnection(rtcConfig);

        pcRef.current.onicecandidate = (e) => {
          if (e.candidate) {
            socket.emit("signal:ice-candidate", {
              roomId, candidate: e.candidate
            });
          }
        };

        pcRef.current.onconnectionstatechange = () => {
          const st = pcRef.current.connectionState;
          setConnected(st === "connected");
        };

        pcRef.current.ondatachannel = (e) => {
          // As answerer, receive the channel created by offerer
          channelRef.current = e.channel;
          wireChannel();
        };
      }
    }

    function wireChannel() {
      const ch = channelRef.current;
      if (!ch) return;

      ch.onopen = () => setConnected(true);
      ch.onmessage = (e) => pushMessage(String(e.data), "peer");
      ch.onclose = () => setConnected(false);
    }

    async function createOfferFlow() {
      ensurePC();
      // Offerer creates data channel
      channelRef.current = pcRef.current.createDataChannel("chat");
      wireChannel();

      const offer = await pcRef.current.createOffer();
      await pcRef.current.setLocalDescription(offer);
      socket.emit("signal:offer", { roomId, sdp: offer });
    }

    // Receive offer (answerer)
    socket.on("signal:offer", async ({ sdp }) => {
      ensurePC();
      await pcRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
      const answer = await pcRef.current.createAnswer();
      await pcRef.current.setLocalDescription(answer);
      socket.emit("signal:answer", { roomId, sdp: answer });
    });

    // Receive answer (offerer)
    socket.on("signal:answer", async ({ sdp }) => {
      await pcRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
    });

    // Receive ICE candidates
    socket.on("signal:ice-candidate", async ({ candidate }) => {
      try {
        await pcRef.current?.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.error("Error adding ICE", err);
      }
    });

    // Handle peer leave
    socket.on("peer-left", () => {
      pushMessage("Peer left. You can refresh or wait for someone new.", "system");
      setConnected(false);
      try { channelRef.current?.close(); } catch {}
      try { pcRef.current?.close(); } catch {}
      pcRef.current = null;
      channelRef.current = null;
    });

    return () => {
      socket.off("signal:offer");
      socket.off("signal:answer");
      socket.off("signal:ice-candidate");
      socket.off("peer-left");
      if (channelRef.current?.readyState === "open") channelRef.current.close();
      pcRef.current?.close();
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, pushMessage]);

  const send = useCallback((text) => {
    if (channelRef.current?.readyState === "open") {
      channelRef.current.send(text);
      pushMessage(text, "me");
    }
  }, [pushMessage]);

  return { connected, messages, send, role };
}

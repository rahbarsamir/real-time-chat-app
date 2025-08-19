import { IoBookSharp } from "react-icons/io5";
import { MdOutlineVideoCall } from "react-icons/md";
import { IoCallOutline } from "react-icons/io5";
import { HiOutlineDotsVertical } from "react-icons/hi";
import '../App.css'
const MessageDisplay = () => {
	return (
		<div className="h-full  flex flex-col w-[70%] bg-transparent">
			{/* Card wrapper with stronger shadow + rounded corners */}
			<div className="h-full bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col">
				{/* Header */}
				<div className="p-4 bg-gradient-to-r from-white to-gray-50 border-b flex items-center gap-4">
					<div className="h-14 w-14 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center shadow-md">
						<span className="text-2xl font-bold text-white">U</span>
					</div>

					<div className="min-w-0">
						<h3 className="flex items-center gap-2 text-lg font-semibold">
							<span>United Family</span>
							<IoBookSharp className="text-xl text-gray-500" />
						</h3>
						<h5 className="text-green-500 text-sm font-medium">
							Rashford is typing...
						</h5>
					</div>

					<div className="flex items-center gap-3 justify-end ml-auto text-gray-600">
						<MdOutlineVideoCall className="text-2xl hover:text-blue-600 transition" />
						<IoCallOutline className="text-2xl hover:text-green-600 transition" />
						<HiOutlineDotsVertical className="text-2xl hover:text-gray-800 transition" />
					</div>
				</div>

				{/* Messages area with inner card feel */}
				<div className="flex-1 overflow-y-auto p-6 bg-gray-50">
					<div className="max-w-3xl mx-auto space-y-6">
						<div className="text-center text-xs text-gray-500">Today</div>

						{/* message from other */}
						<div className="flex items-start gap-3">
							<div className="h-11 w-11 bg-white rounded-full flex items-center justify-center shadow-sm">
								<h3 className="font-semibold text-sm">R</h3>
							</div>
							<div>
								<div className="inline-block bg-white text-gray-800 px-4 py-3 rounded-2xl rounded-bl-none shadow-md border">
									<p className="text-sm">Good Morning</p>
								</div>
								<div className="text-xs text-gray-400 mt-1">
									10:00 AM · Rahber Samir
								</div>
							</div>
						</div>

						<div className="flex items-start gap-3">
							<div className="h-11 w-11 bg-white rounded-full flex items-center justify-center shadow-sm">
								<h3 className="font-semibold text-sm">R</h3>
							</div>
							<div>
								<div className="inline-block bg-white text-gray-800 px-4 py-3 rounded-2xl rounded-bl-none shadow-md border">
									<p className="text-sm">Hey! Are we meeting today?</p>
								</div>
								<div className="text-xs text-gray-400 mt-1">
									10:01 AM · Rahber Samir
								</div>
							</div>
						</div>

						{/* message from me */}
						<div className="flex items-end gap-3 justify-end">
							<div className="text-xs text-gray-400 mr-3">10:02 AM</div>
							<div className="inline-block bg-blue-600 text-white px-4 py-3 rounded-2xl rounded-br-none shadow-lg">
								<p className="text-sm">Yes — 3pm works for me.</p>
							</div>
							<div className="h-11 w-11 bg-blue-600 rounded-full flex items-center justify-center shadow-sm">
								<h3 className="font-semibold text-sm text-white">A</h3>
							</div>
						</div>

					</div>
				</div>

				{/* Composer - elevated with shadow */}
				<div className="p-3 border-t bg-white flex items-center gap-3 shadow-inner">
					<input
						type="text"
						placeholder="Type a message..."
						className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
					/>
					<button className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow">
						Send
					</button>
				</div>
			</div>
		</div>
	);
};

export default MessageDisplay;

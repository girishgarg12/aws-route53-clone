import {
  Bell,
  CircleHelp,
  Search,
  UserCircle,
} from "lucide-react";

export default function Header() {
  return (
    <header className="flex h-14 items-center border-b border-[#30363d] bg-[#161e2d] px-4 text-white">
      <div className="flex w-60 items-center gap-2">
        <div className="flex h-8 w-8  items-center justify-center rounded-sm bg-[#ff9900] text-sm font-bold text-[#161e2d]">
          AWS
        </div>

        <span className="text-sm font-semibold">
          Management Console
        </span>
      </div>

      <div className="flex flex-1 justify-center px-6">
        <div className="flex w-full max-w-2xl items-center rounded-sm border border-[#4b5563] bg-[#253143] px-3">
          <Search
            size={17}
            className="text-[#aab7c4]"
          />

          <input
            type="text"
            placeholder="Search"
            className="w-full bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-[#aab7c4]"
          />
        </div>
      </div>

      <div className="flex items-center gap-5">
        <button
          className="text-[#d5dbdb] hover:text-white"
          aria-label="Help"
        >
          <CircleHelp size={18} />
        </button>

        <button
          className="text-[#d5dbdb] hover:text-white"
          aria-label="Notifications"
        >
          <Bell size={18} />
        </button>

        <button className="flex items-center gap-2 text-sm">
          <UserCircle size={21} />
          <span>Girish</span>
        </button>
      </div>
    </header>
  );
}
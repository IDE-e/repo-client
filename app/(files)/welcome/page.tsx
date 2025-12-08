"use client";

import { FileText, GitBranch, Folder, Settings, Box } from "lucide-react";

export default function WelcomePage() {
  return (
    <>
      <h1 className="text-4xl font-bold mb-6 text-text-default">Welcome</h1>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-3 text-point">Start</h2>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-text-default hover:text-white cursor-pointer">
              <FileText size={14} className="text-point" />
              <span>New File...</span>
            </div>
            <div className="flex items-center gap-2 text-text-default hover:text-white cursor-pointer">
              <Folder size={14} className="text-point" />
              <span>Open Folder...</span>
            </div>
            <div className="flex items-center gap-2 text-text-default hover:text-white cursor-pointer">
              <GitBranch size={14} className="text-point" />
              <span>Clone Repository...</span>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3 text-point">Recent</h2>
          <div className="space-y-2 text-sm text-text-soft">
            <div>No recent folders</div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3 text-point">Customize</h2>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-text-default hover:text-white cursor-pointer">
              <Settings size={14} className="text-point" />
              <span>Settings</span>
            </div>
            <div className="flex items-center gap-2 text-text-default hover:text-white cursor-pointer">
              <Box size={14} className="text-point" />
              <span>Extensions</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

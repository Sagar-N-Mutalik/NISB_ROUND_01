import Navbar from "./Navbar";
import { ReactNode } from "react";

export default function GameLayout({ children }: { children: ReactNode }) {
  return (
    // Main container: Sets the dark theme, font, and full-screen height.
    // Uses a flex-column layout to place the Navbar above the main content.
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-200 font-sans">
      <Navbar />

      {/* Main content area: 
        - Uses 'flex-grow' to take up all available vertical space.
        - Uses 'flex' with 'items-center' and 'justify-center' to center the child game component.
        - Adds padding to prevent content from touching the screen edges.
      */}
      <main className="flex flex-grow items-center justify-center p-4">
        {children}
      </main>
    </div>
  );
}
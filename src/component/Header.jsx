import { Menu, Heart, ShoppingCart, Search } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white sticky top-0 z-50">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Muli:wght@700;800&display=swap');
        .meesho-logo {
          font-family: 'Muli', sans-serif;
        }
      `}</style>
      <div className="px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Menu Icon and Logo */}
          <div className="flex items-center gap-3">
            <button className="text-gray-700 hover:text-gray-900 flex items-center">
              <Menu className="w-7 h-7" strokeWidth={2} />
            </button>
            <img 
              src="https://www.meesho.com/assets/svgicons/meeshoLogo.svg" 
              alt="Meesho" 
              className="h-8 mb-2"
            />
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-5">
            <button className="hover:opacity-80">
              <Heart className="w-8 h-8" fill="#FF4772" stroke="#FF4772" strokeWidth={2} />
            </button>
            <button className="hover:opacity-80">
              <ShoppingCart className="w-8 h-8" fill="#C724B1" stroke="#C724B1" strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {/* <div className="mt-4 relative">
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
            <Search className="w-5 h-5 text-gray-400 ml-4" />
            <input
              type="text"
              placeholder="Search for Sarees, Kurtis, Cosmetics, etc."
              className="w-full px-3 py-3 text-sm bg-gray-50 focus:outline-none text-gray-700 placeholder-gray-500"
            />
          </div>
        </div> */}
      </div>
    </header>
  );
}
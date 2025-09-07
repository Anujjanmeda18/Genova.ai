import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div className="text-gray-500/80 pt-8 px-6 md:px-16 lg:px-24 xl:px-32">
      <div className="flex flex-wrap justify-between gap-12 md:gap-6">
        {/* Brand info */}
        <div className="max-w-80">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="200"
            height="50"
            viewBox="0 0 200 50"
            fill="none"
          >
            <text
              x="50%"
              y="50%"
              dominant-baseline="middle"
              text-anchor="middle"
              font-family="Arial, Helvetica, sans-serif"
              font-weight="bold"
              font-size="28"
              fill="#5044E5"
              onClick={() => navigate("/")}
            >
              Genova.ai
            </text>
          </svg>

          <p className="text-sm">
            Genova.ai helps you create high-quality content with AI — from
            articles and blogs to visuals and resumes — faster and smarter.
          </p>
          <div className="flex items-center gap-3 mt-4">
            {/* Instagram */}
            <a
              href="https://www.instagram.com/anuj_janmeda18/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                className="w-6 h-6 hover:text-pink-500"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M7.75 2A5.75 5.75 0 002 7.75v8.5A5.75 5.75 0 007.75 22h8.5A5.75 5.75 0 0022 16.25v-8.5A5.75 5.75 0 0016.25 2h-8.5zM4.5 7.75A3.25 3.25 0 017.75 4.5h8.5a3.25 3.25 0 013.25 3.25v8.5a3.25 3.25 0 01-3.25 3.25h-8.5a3.25 3.25 0 01-3.25-3.25v-8.5zm9.5 1a4 4 0 11-4 4 4 4 0 014-4zm0 1.5a2.5 2.5 0 102.5 2.5 2.5 2.5 0 00-2.5-2.5zm3.5-.75a.75.75 0 11.75-.75.75.75 0 01-.75.75z" />
              </svg>
            </a>
            {/* GitHub */}
            <a
              href="https://github.com/Anujjanmeda18"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                className="w-6 h-6 hover:text-gray-800"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 
      8.205 11.385.6.113.82-.262.82-.582 
      0-.287-.012-1.243-.018-2.255-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.083-.73.083-.73 
      1.205.084 1.84 1.237 1.84 1.237 
      1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.304.762-1.604-2.665-.304-5.466-1.332-5.466-5.93 
      0-1.31.468-2.382 1.236-3.22-.124-.303-.536-1.524.118-3.176 
      0 0 1.008-.322 3.3 1.23a11.5 11.5 0 013.003-.404c1.02.005 
      2.047.138 3.003.404 2.29-1.552 3.297-1.23 
      3.297-1.23.655 1.652.243 2.873.12 3.176.77.838 
      1.235 1.91 1.235 3.22 0 4.61-2.803 5.624-5.475 
      5.922.43.37.823 1.103.823 2.222 
      0 1.604-.014 2.896-.014 3.286 
      0 .322.218.7.825.58C20.565 21.796 
      24 17.297 24 12c0-6.63-5.37-12-12-12z"
                  clipRule="evenodd"
                />
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                className="w-6 h-6 hover:text-blue-700"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M4.98 3.5C3.88 3.5 3 4.38 3 5.48c0 1.1.88 1.98 1.98 1.98h.02c1.1 0 1.98-.88 1.98-1.98C6.98 4.38 6.1 3.5 4.98 3.5zM3 8.75h3.96V21H3V8.75zm6.25 0h3.8v1.68h.05c.53-.98 1.82-2.02 3.75-2.02 4.01 0 4.75 2.64 4.75 6.07V21H17v-5.63c0-1.34-.03-3.07-1.88-3.07-1.88 0-2.17 1.47-2.17 2.98V21H9.25V8.75z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Company section */}
        <div>
          <p className="text-lg text-gray-800 font-semibold">Company</p>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            <li>
              <a href="/about">About Us</a>
            </li>
            <li>
              <a href="/careers">Careers</a>
            </li>
            <li>
              <a href="/blog">Blog</a>
            </li>
            <li>
              <a href="/partners">Partners</a>
            </li>
            <li>
              <a href="/contact">Contact</a>
            </li>
          </ul>
        </div>

        {/* Support section */}
        <div>
          <p className="text-lg text-gray-800 font-semibold">Support</p>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            <li>
              <a href="/help">Help Center</a>
            </li>
            <li>
              <a href="/faq">FAQs</a>
            </li>
            <li>
              <a href="/guides">Guides</a>
            </li>
            <li>
              <a href="/api-docs">API Docs</a>
            </li>
            <li>
              <a href="/accessibility">Accessibility</a>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="max-w-80">
          <p className="text-lg text-gray-800 font-semibold">Stay Updated</p>
          <p className="mt-3 text-sm">
            Join our newsletter to receive AI insights, tips, and product
            updates.
          </p>
          <div className="flex items-center mt-4">
            <input
              type="text"
              className="bg-white rounded-l border border-gray-300 h-9 px-3 outline-none"
              placeholder="Your email"
            />
            <button className="flex items-center justify-center bg-primary h-9 w-9 aspect-square rounded-r">
              <svg
                className="w-4 h-4 text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 12H5m14 0-4 4m4-4-4-4"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <hr className="border-gray-300 mt-8" />

      <div className="flex flex-col md:flex-row gap-2 items-center justify-between py-5">
        <p>© {new Date().getFullYear()} Genova.ai. All rights reserved.</p>
        <ul className="flex items-center gap-4 text-sm">
          <li>
            <a href="/privacy">Privacy Policy</a>
          </li>
          <li>
            <a href="/terms">Terms of Service</a>
          </li>
          <li>
            <a href="/sitemap">Sitemap</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Footer;

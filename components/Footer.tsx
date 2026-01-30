export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[#f1eaea] bg-white py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
        <p className="text-sm text-[#6b5c5c]">
          © 2024 ToeVol Platform. Keep learning.
        </p>
        <div className="flex gap-4">
          <a
            className="text-sm text-[#6b5c5c] hover:text-[#e54d42]"
            href="#"
          >
            Privacy
          </a>
          <a
            className="text-sm text-[#6b5c5c] hover:text-[#e54d42]"
            href="#"
          >
            Terms
          </a>
          <a
            className="text-sm text-[#6b5c5c] hover:text-[#e54d42]"
            href="#"
          >
            Help
          </a>
        </div>
      </div>
    </footer>
  );
}

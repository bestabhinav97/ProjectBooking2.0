import { useEffect, useRef, useState } from "react";

function TopBar() {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState("English");
  const ref = useRef(null);


  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="topbar">
      <div className="topbar-language" ref={ref}>
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
        >
          
          <span className="material-symbols-outlined globe-icon">
            globe
          </span>

          
          <span>{lang}</span>
        </button>

        
        {open && (
          <div className="language-dropdown">
            <button
              type="button"
              onClick={() => {
                setLang("English");
                setOpen(false);
              }}
            >
              English
            </button>

            <button
              type="button"
              onClick={() => {
                setLang("Svenska");
                setOpen(false);
              }}
            >
              Svenska
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TopBar;
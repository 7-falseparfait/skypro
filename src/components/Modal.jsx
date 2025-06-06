import { useRef, useEffect, useState } from 'react';
import modalImg from '/src/assets/InnerBG.webp';
import cancel from '/src/assets/cancel.png';

export function Modal({ open, onClose, children, className = '' }) {
  const modalRef = useRef();
  const contentRef = useRef();
  const [show, setShow] = useState(open);
  const [exiting, setExiting] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (open) {
      setShow(true);
      setExiting(false);
      setScrolled(false);
      if (contentRef.current) {
        contentRef.current.scrollTop = 0;
      }
    } else if (show) {
      setExiting(true);
      const timeout = setTimeout(() => {
        setShow(false);
        setExiting(false);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [open, show]);

  useEffect(() => {
    if (show) {
      document.body.classList.add('overflow-hidden');
      document.documentElement.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
      document.documentElement.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
      document.documentElement.classList.remove('overflow-hidden');
    };
  }, [show]);

  useEffect(() => {
    if (show && modalRef.current) {
      modalRef.current.focus();
    }
  }, [show]);

  useEffect(() => {
    const contentElement = contentRef.current;
    if (!contentElement) return;

    const handleScroll = () => {
      setScrolled(contentElement.scrollTop > 5);
    };

    contentElement.addEventListener('scroll', handleScroll);
    return () => contentElement.removeEventListener('scroll', handleScroll);
  }, [show]);

  return (
    <div>
      {open && (
        <section
          className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-center items-start ${className}`}
          onClick={onClose}
        >
          {show && (
            <div
              ref={modalRef}
              tabIndex={-1}
              className=" fixed inset-0 z-100 flex justify-center items-start pointer-events-none lg:relative lg:place-self-center"
              onClick={onClose}
            >
              <div className="absolute hidden lg:block top-[-0.7rem] -right-2 z-[1000] pointer-events-auto">
                <button
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 hover:cursor-pointer transition-all"
                  onClick={onClose}
                  aria-label="Close"
                  style={{ pointerEvents: 'auto' }}
                >
                  <img src={cancel} alt="Close" className="w-5 h-5" />
                </button>
              </div>

              <div
                ref={contentRef}
                className={`
        pointer-events-auto pb-50 lg:pb-5 lg:place-self-center lg:px-8 relative
        bg-white w-full shadow-lg
        transition-all duration-300 ease-out
        flex flex-col z-[200]
        overflow-x-hidden overflow-y-auto
        h-[100vh] hide-scrollbar
        lg:w-[60vw] lg:h-[89vh]
        ${exiting ? 'animate-modal-out' : 'animate-modal-in'}
        ${
          scrolled ? 'mt-[0vh] rounded-none lg:rounded-3xl ' : 'mt-[5vh] lg:mt-[0vh] lg:rounded-3xl'
        }
      `}
                style={{
                  transform: scrolled ? 'translateY(0)' : 'translateY(10vh)',
                  transition: 'transform 0.3s ease-out, border-radius 0.3s ease-out',
                }}
                onClick={e => e.stopPropagation()}
              >
                <div
                  className="absolute z- top-2 right-2 lg:hidden"
                  style={{ pointerEvents: 'auto' }}
                >
                  <button
                    className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-50 hover:bg-gray-100 hover:cursor-pointer transition-all"
                    onClick={onClose}
                    aria-label="Close"
                    style={{ pointerEvents: 'auto' }}
                  >
                    <img src={cancel} alt="Close" className="w-5 h-5" />
                  </button>
                </div>
                <div className="w-[90%] mx-auto mt-10 flex justify-center items-center min-h-[17rem] lg:min-h-[28rem] xl:min-h-[19rem] lg:w-[100%] lg:mx-auto lg:mt-6">
                  <img
                    src={modalImg}
                    alt="modal background"
                    className="h-full place-self-center"
                    loading="lazy"
                    style={{ objectFit: 'contain' }}
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col">{children}</div>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

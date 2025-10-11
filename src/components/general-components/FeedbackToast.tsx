import * as Toast from "@radix-ui/react-toast";
import { useFeedbackToast } from "../../hooks/useFeedbackToast";
import { useLanguage } from "../../contexts/LanguageContext";
import { tl } from "../../translations/translation";

export function FeedbackToast() {
  const {
    open,
    setOpen,
    submitted,
    message,
    setMessage,
    prompt,
    handleSubmit,
  } = useFeedbackToast();

  const { currentLanguage } = useLanguage();
  
  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 
                     bg-orange-500 hover:bg-orange-600
                     text-white font-medium play-regular
                     px-4 py-2 rounded-full shadow-xl transition-colors">
          💬 Feedback
        </button>
      )}
      <Toast.Root
        className="fixed bottom-6 right-6 z-[99] w-96 max-w-[90vw] text-white rounded-xl shadow-2xl border
                   data-[state=open]:animate-slideIn data-[state=closed]:animate-hide"
        open={open}
        onOpenChange={setOpen}
        duration={60_000}>
        <div className="flex justify-between items-center px-4 py-3 rounded-t-xl">
          <Toast.Close asChild>
            <button
              className="text-white/80 hover:text-white transition"
              aria-label="Fechar">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </Toast.Close>
        </div>
        {!submitted ? (
          <form
            onSubmit={handleSubmit}
            name="watchit-feedback"
            method="POST"
            netlify
            className="flex flex-col gap-4 p-4 play-regular">

            <input type="hidden" name="form-name" value="watchit-feedback" />
            <input type="hidden" name="prompt" value={prompt} />

            <Toast.Description className="text-sm text-faceit-text-light">
              {prompt}
            </Toast.Description>

            <textarea
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full h-24 
                         rounded-md 
                         border border-faceit-border 
                         text-white text-sm 
                         p-3 resize-none play-regular
                         placeholder-faceit-text-light/50
                         focus:outline-none focus:ring-1 focus:ring-faceit-orange"
              placeholder="..."
              required/>
            
            <button
              type="submit"
              className=" hover:bg-orange-700 transition 
                         text-sm font-semibold py-2 rounded-md text-white">
              {tl(currentLanguage, 'feedback.status.submit_feedback')}
            </button>
          </form>
        ) : (
          <div className="flex items-center gap-3 p-4 text-green-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-medium">{tl(currentLanguage, 'feedback.status.submitted_successfully')}</span>
          </div>
        )}
      </Toast.Root>
    </>
  );
}
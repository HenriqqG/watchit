import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { tl } from "../translations/translation";

const feedbackPromptsLength = 10;

interface UseFeedbackToastResult {
  open: boolean;
  setOpen: (open: boolean) => void;
  submitted: boolean;
  message: string;
  setMessage: (message: string) => void;
  prompt: string;
  handleSubmit: (e: React.FormEvent) => void;
}

export function useFeedbackToast(): UseFeedbackToastResult {
  const { currentLanguage } = useLanguage();
  
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState("");
  const [prompt, setPrompt] = useState("");

  const getRandomPrompt = useCallback(() => {
    const random = tl(currentLanguage, `feedback.prompts.${Math.floor(Math.random() * feedbackPromptsLength)}`);
    return random;
  }, [currentLanguage ]);

  useEffect(() => {
    if (open) {
      setPrompt(getRandomPrompt());
      setMessage("");
      setSubmitted(false);
    }
  }, [open, getRandomPrompt]);

  const handleSubmit = useCallback(
  async (e: React.FormEvent) => {
    e.preventDefault();

    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    const data = new URLSearchParams(formData as any).toString();

    try {
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: data,
      });

      if (response.ok) {
        setSubmitted(true);
        setMessage('');
        setTimeout(() => setOpen(false), 2000);
      } else {
        console.error("Netlify form submission failed with status:", response.status);
        alert(tl(currentLanguage, 'feedback.errors.submit_failed'));
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(tl(currentLanguage, 'feedback.errors.network'));
    }
  },
  [setSubmitted, setOpen, setMessage]
);

  return {
    open,
    setOpen,
    submitted,
    message,
    setMessage,
    prompt,
    handleSubmit,
  };
}   
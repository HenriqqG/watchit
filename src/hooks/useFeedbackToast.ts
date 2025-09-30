import { useState, useEffect, useCallback } from "react";

const feedbackPrompts = [
  "Hey, you’ve used WatchIT a bit now—mind telling us how it’s treating you?",
  "Got a minute? We’d love to hear what’s working (and what’s annoying).",
  "We’re cooking up new features—what would make your life easier?",
  "Any rough edges you’ve noticed? Your tips help us smooth things out.",
  "You’re the pro here. What’s the one thing you’d tweak if you could?",
  "Your thoughts = better updates. What’s on your mind?",
  "Thanks for hanging with us! Anything you’d like to see next?",
  "If WatchIT had a magic button, what should it do?",
  "Big or small, every idea counts. Got one to share?",
  "We’re listening. How can we make your next queue even better?",
];

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
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState("");
  const [prompt, setPrompt] = useState("");

  const getRandomPrompt = useCallback(() => {
    const random =
      feedbackPrompts[Math.floor(Math.random() * feedbackPrompts.length)];
    return random;
  }, []);

  useEffect(() => {
    if (open) {
      setPrompt(getRandomPrompt());
      setMessage("");
      setSubmitted(false);
    }
  }, [open, getRandomPrompt]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setOpen(false), 2000);
  }, []);

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
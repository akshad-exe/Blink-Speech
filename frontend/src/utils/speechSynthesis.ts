export function speakPhrase(text: string) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  } else {
    console.warn('Speech Synthesis API not supported in this browser');
  }
}

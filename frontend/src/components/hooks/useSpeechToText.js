import { useEffect, useRef, useState } from "react";

const useSpeechToText = () => {
    const [text, setText] = useState('');
    const [listening, setListening] = useState(false);

    const recognition = useRef(null);

    useEffect(() => {
        const { webkitSpeechRecognition } = window;
        recognition.current = new webkitSpeechRecognition();
        recognition.current.continuous = true;
        recognition.current.lang = 'en-US';

        recognition.current.onresult = (event) => {
            setText(event.results[event.results.length - 1][0].transcript);
        }
    }, []);

    const start = () => {
        setText('');
        recognition.current.start();
        setListening(true);
    }

    const stop = () => {
        recognition.current.stop();
        setListening(false);
    }

    return { text, listening, start, stop };
}

export default useSpeechToText;
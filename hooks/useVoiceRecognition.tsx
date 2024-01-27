import Voice, {
    SpeechErrorEvent,
    SpeechRecognizedEvent,
    SpeechResultsEvent,
} from '@react-native-voice/voice';
import { useCallback, useEffect, useState } from 'react';

interface IState {
    recognized: string;
    pitch: string;
    error: string;
    started: string;
    results: string[];
    partialResults: string[];
    isRecording: boolean;
}

export const useVoiceRecognition = () => {
    const [state, setState] = useState<IState>({
        recognized: "",
        pitch: "",
        error: "",
        started: "",
        results: [],
        partialResults: [],
        isRecording: false,
    });

    const resetState = useCallback(() => {
        setState({
            recognized: "",
            pitch: "",
            error: "",
            started: "",
            results: [],
            partialResults: [],
            isRecording: false,
        });
    },[setState]);
    
    const startRecognizing = useCallback(async () => {
        resetState();
        try {
            await Voice.start("en-US");
        } catch(e){
            console.error("Error starting recognition", e);
        }
    },[resetState]);

    const stopRecognizing = useCallback(async () => {
        resetState();
        try {
            await Voice.stop();
        } catch(e){
            console.error("Error stoping recognition", e);
        }
    },[]);

    const cancelRecognizing = useCallback(async () => {
        resetState();
        try {
            await Voice.cancel();
        } catch(e){
            console.error("Error canceling recognition", e);
        }
    },[]);

    const destroyRecognizer = useCallback(async () => {
        resetState();
        try {
            await Voice.destroy();
        } catch(e){
            console.error("Error destroying recognition", e);
        }
        resetState();
    }, [resetState]);

    useEffect(() => {
        Voice.onSpeechStart = (e: any) => {
          setState((prevState) => ({
            ...prevState,
            started: "√",
            isRecording: true,
          }));
        };
        Voice.onSpeechRecognized = () => {
          setState((prevState) => ({ ...prevState, recognized: "√" }));
        };
        Voice.onSpeechEnd = (e: any) => {
          setState((prevState) => ({ ...prevState, end: "√", isRecording: false }));
        };
        Voice.onSpeechError = (e: SpeechErrorEvent) => {
          setState((prevState) => ({
            ...prevState,
            error: JSON.stringify(e.error),
            isRecording: false,
          }));
        };
        Voice.onSpeechResults = (e: SpeechResultsEvent) => {
          if (e.value) {
            setState((prevState) => ({ ...prevState, results: e.value! }));
          }
        };
        Voice.onSpeechPartialResults = (e: SpeechResultsEvent) => {
          if (e.value) {
            setState((prevState) => ({ ...prevState, partialResults: e.value! }));
          }
        };
        Voice.onSpeechVolumeChanged = (e: any) => {
          setState((prevState) => ({ ...prevState, pitch: e.value }));
        };
    
        return () => {
          Voice.destroy().then(Voice.removeAllListeners);
        };
      }, []);

    return {
        state,
        setState,
        resetState,
        startRecognizing,
        stopRecognizing,
        cancelRecognizing,
        destroyRecognizer,
    };
};
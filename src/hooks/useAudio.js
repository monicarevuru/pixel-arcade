import { getAudioContext, playNote, playDodgeSound, playGameOverSound, playSuccessSound } from '../utils/audioEngine';

export function useAudio() {
  return { playNote, playDodgeSound, playGameOverSound, playSuccessSound, getAudioContext };
}

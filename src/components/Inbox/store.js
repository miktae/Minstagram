import create from 'zustand'

const useStore = create((set) => ({
    audioSrc: "",
    setAudioSrc: (src) => set(
        (state) => (
            {
                audioSrc: src
            })),
    audioView: true,
    setAudioView: (view) => set(
        (state) => (
            {
                audioView: view
            })),
}))

export default useStore
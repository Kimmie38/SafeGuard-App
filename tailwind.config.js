/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        navy: "#14213D",
        "navy-light": "#243A63",
        amber: "#F2A93B",
        "amber-dark": "#8A5C15",
        teal: "#0F6E56",
        "teal-light": "#DCEFE8",
        coral: "#D8492F",
        "coral-light": "#FBE6E1",
        canvas: "#F7F5F0",
        card: "#FFFFFF",
        ink: "#1B1B1D",
        mist: "#7A7C85",
        hairline: "#E7E4DC",
      },
      fontFamily: {
        display: ["SpaceGrotesk_600SemiBold"],
        "display-bold": ["SpaceGrotesk_700Bold"],
        body: ["Inter_400Regular"],
        "body-medium": ["Inter_500Medium"],
        "body-semibold": ["Inter_600SemiBold"],
      },
    },
  },
  plugins: [],
};

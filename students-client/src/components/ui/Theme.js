import { createMuiTheme } from "@material-ui/core/styles";

const studentsPrimary = "#be5683";
const studentsSecondary = "#f6ab6c";
const studentsGrey = "#b0cac7";
export default createMuiTheme({
  palette: {
    common: {
      studentsPrimary: studentsPrimary,
      studentsSecondary: studentsSecondary,
      studentsGrey: studentsGrey,
    },
    primary: {
      main: studentsPrimary,
    },
    secondary: {
      main: studentsSecondary,
    },
  },
  typography: {
    tab: {
      fontFamily: "Raleway",
      textTransform: "none",
      fontSize: "1rem",
      fontWeight: "700",
    },
    h2: {
      fontFamily: "Raleway",
      lineHeight: 1.5,
      fontSize: "2.5rem",
      color: `${studentsPrimary}`,
      fontWeight: "700",
    },
    h3: {
      fontFamily: "Raleway",
      fontSize: "2.5rem",
      color: `${studentsPrimary}`,
    },
    h4: {
      fontFamily: "Raleway",
      fontSize: "1.75rem",
      color: `${studentsPrimary}`,
    },

    subtitle1: {
      fontSize: "1.25em",
      color: studentsGrey,
      fontWeight: 300,
    },
    subtitle2: {
      fontSize: "1.25em",
      color: "white",
      fontWeight: 300,
    },
    subtitle3: {
      fontSize: "0.8em",
      color: studentsGrey,
      fontWeight: 300,
    },
    estimate: {
      fontWeight: "700",
      fontFamily: "Raleway",
      textTransform: "none",
      fontSize: "1rem",
      color: "#fff",
    },
    learnButton: {
      borderColor: studentsPrimary,
      borderWidth: 2,
      textTransform: "none",
      borderRadius: 50,
      fontFamily: "Roboto",
      fontWeight: "700",
      color: studentsPrimary,
    },
  },
  overrides: {
    MuiTab: {
      textColorPrimary: {
        color: studentsPrimary,
      },
    },
    // MuiButton: {
    //   containedSecondary: {
    //     color: "#0f4c75",
    //   },
    // },
  },
});

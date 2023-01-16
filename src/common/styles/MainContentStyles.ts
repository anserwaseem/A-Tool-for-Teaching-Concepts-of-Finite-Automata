import { DrawerWidth } from "../../consts/DrawerWidth";

export const MainContentStyles = (
  open: number,
  rowsLength: number,
  rightDrawerExists?: boolean
) => ({
  //   ...(window.innerWidth <= 525 && {
  marginLeft:
    "-" +
    (window.innerWidth <= 525
      ? window.innerWidth
      : open === 1
      ? 0
      : DrawerWidth) +
    "px !important",
  //   }),

  ...(rightDrawerExists &&
    window.innerWidth <= 525 && {
      marginRight:
        "-" +
        (window.innerWidth <= 525
          ? window.innerWidth
          : open !== 0
          ? 0
          : DrawerWidth) +
        "px !important",
    }),

  paddingTop:
    window.innerWidth <= 525 && open !== 0
      ? (rowsLength + 1) * 48 + // table row height (+1 for the header row)
        40 + // drawer header min height
        8 + // padding between appbar and drawer header
        8 + // padding between drawer header and table
        56 + // appbar height
        "px !important"
      : "24px", // theme spacing(3)
});

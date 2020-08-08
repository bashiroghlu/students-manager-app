import React, { useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import SendIcon from "@material-ui/icons/Send";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import PeopleIcon from "@material-ui/icons/People";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import CardMembershipIcon from "@material-ui/icons/CardMembership";
import DashboardIcon from "@material-ui/icons/Dashboard";
import ContactMailIcon from "@material-ui/icons/ContactMail";
import DynamicFeedIcon from "@material-ui/icons/DynamicFeed";
import AddIcon from "@material-ui/icons/Add";
import MoreIcon from "@material-ui/icons/MoreVert";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import logo from "../../assets/logo.svg";
import { AuthContext } from "../../context/auth-context";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },

  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: "auto",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  swipeableDrawer: {
    minWidth: 240,
  },
  toolbarMargin: {
    ...theme.mixins.toolbar,
  },
}));

export default function ClippedDrawer() {
  const classes = useStyles();
  const theme = useTheme();
  const auth = useContext(AuthContext);
  const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [swipeableDrawerOpen, setSwipeableDrawerOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("Overveiw");

  const isMenuOpen = Boolean(anchorEl);
  const matchesMD = useMediaQuery(theme.breakpoints.down("md"));

  const mobileMenuId = "primary-search-account-menu-mobile";

  let MenuOptions = [];
  if (auth.status === "chief-manager") {
    MenuOptions = [
      { name: "Overveiw", route: "/", icon: <DashboardIcon /> },
      { name: "Employees", route: "/employees", icon: <ContactMailIcon /> },
      { name: "Students", route: "/students", icon: <PeopleIcon /> },

      { name: "Exams", route: "/exams", icon: <CardMembershipIcon /> },
      {
        name: "Start Live Exam",
        route: "/startliveexam",
        icon: <DynamicFeedIcon />,
      },
      {
        name: "Send Email",
        route: "/send-email",
        icon: <SendIcon />,
      },
      {
        name: "Manage groups",
        route: "/manage-groups",
        icon: <GroupAddIcon />,
      },
      {
        name: "Add group",
        route: "/add-group",
        icon: <AddIcon />,
      },
    ];
  } else if (auth.status === "manager") {
    MenuOptions = [
      { name: "Overveiw", route: "/", icon: <DashboardIcon /> },
      { name: "Students", route: "/students", icon: <PeopleIcon /> },

      { name: "Exams", route: "/exams", icon: <CardMembershipIcon /> },
      {
        name: "Start Live Exam",
        route: "/startliveexam",
        icon: <DynamicFeedIcon />,
      },
      {
        name: "Send Email",
        route: "/send-email",
        icon: <SendIcon />,
      },
      {
        name: "Manage groups",
        route: "/manage-groups",
        icon: <GroupAddIcon />,
      },
      {
        name: "Add group",
        route: "/add-group",
        icon: <AddIcon />,
      },
    ];
  } else if (auth.status === "teacher") {
    MenuOptions = [
      { name: "Overveiw", route: "/", icon: <DashboardIcon /> },
      { name: "Students", route: "/students", icon: <PeopleIcon /> },
      { name: "Exams", route: "/exams", icon: <CardMembershipIcon /> },
      {
        name: "Start Live Exam",
        route: "/startliveexam",
        icon: <DynamicFeedIcon />,
      },
      {
        name: "Send Email",
        route: "/send-email",
        icon: <SendIcon />,
      },
    ];
  } else if (auth.status === "student") {
    MenuOptions = [{ name: "Overveiw", route: "/", icon: <DashboardIcon /> }];
  }

  useEffect(() => {
    [
      ...MenuOptions,
      { name: "Account", route: "/myaccount" },
      { name: "Exam", route: "/publish-results/" },
    ].forEach((option) => {
      switch (window.location.pathname) {
        case `${option.route}`:
          setActiveTab(option.name);
          break;

        default:
          break;
      }
      if (
        window.location.pathname.includes("publish-result") ||
        window.location.pathname.includes("ieltsexams")
      ) {
        setActiveTab("Exams");
      }
    });
  }, [MenuOptions]);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose} component={Link} to="/myaccount">
        My account
      </MenuItem>
      <MenuItem onClick={auth.logout}>Logout</MenuItem>
    </Menu>
  );

  const sectionDesktop = (
    <div className={classes.sectionDesktop}>
      <IconButton
        edge="end"
        aria-label="account of current user"
        aria-controls={menuId}
        aria-haspopup="true"
        onClick={handleProfileMenuOpen}
        color="inherit"
      >
        <AccountCircle />
      </IconButton>
    </div>
  );
  const sectionMobile = (
    <div className={classes.sectionMobile}>
      <IconButton
        aria-label="show more"
        aria-controls={mobileMenuId}
        aria-haspopup="true"
        onClick={handleProfileMenuOpen}
        color="inherit"
      >
        <MoreIcon />
      </IconButton>
    </div>
  );
  const swipeableDrawerComponent = (
    <SwipeableDrawer
      disableBackdropTransition={!iOS}
      disableDiscovery={iOS}
      open={swipeableDrawerOpen}
      onClose={() => setSwipeableDrawerOpen(false)}
      onOpen={() => setSwipeableDrawerOpen(true)}
      classes={{ paper: classes.swipeableDrawer }}
    >
      <List>
        {MenuOptions.map((props, index) => (
          <ListItem
            button
            key={props.name}
            component={Link}
            to={props.route}
            {...props}
            onClick={() => {
              setSwipeableDrawerOpen(false);
              setActiveTab(props.name);
            }}
            selected={props.name === activeTab}
          >
            <ListItemIcon>{props.icon}</ListItemIcon>
            <ListItemText primary={props.name} />
          </ListItem>
        ))}
      </List>
    </SwipeableDrawer>
  );
  const drawerComponent = (
    <Drawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <Toolbar />
      <div className={classes.drawerContainer}>
        <List>
          {MenuOptions.map((props) => (
            <ListItem
              button
              {...props}
              key={props.name}
              component={Link}
              to={props.route}
              selected={props.name === activeTab}
              onClick={() => {
                setActiveTab(props.name);
              }}
            >
              <ListItemIcon>{props.icon}</ListItemIcon>
              <ListItemText primary={props.name} />
            </ListItem>
          ))}
        </List>
      </div>
    </Drawer>
  );

  return (
    <React.Fragment>
      <AppBar position="fixed" className={classes.appBar}>
        <CssBaseline />

        <Toolbar>
          {matchesMD ? (
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="open drawer"
              onClick={() => setSwipeableDrawerOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Link
              to="/"
              onClick={() => {
                setActiveTab("Overveiw");
              }}
            >
              <img src={logo} className={classes.logo} alt="company logo" />
            </Link>
          )}

          <div className={classes.grow} />
          {sectionDesktop}
          {sectionMobile}
        </Toolbar>
      </AppBar>
      <div className={classes.toolbarMargin} />

      {renderMenu}
      {renderMenu}
      {matchesMD ? swipeableDrawerComponent : drawerComponent}
    </React.Fragment>
  );
}

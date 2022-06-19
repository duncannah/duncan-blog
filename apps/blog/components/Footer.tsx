import { NextPage } from "next";
import styles from "./Footer.module.scss";

export const Footer: NextPage = () => {
	return <footer className={styles.Footer}>{`© ${new Date().getFullYear()}`}</footer>;
};

export default Footer;

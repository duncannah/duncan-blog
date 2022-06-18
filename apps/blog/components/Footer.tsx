import { NextPage } from "next";
import styles from "./Footer.module.scss";

export const Footer: NextPage = () => {
	return <footer className={styles.Footer}>{`© 2022`}</footer>;
};

export default Footer;

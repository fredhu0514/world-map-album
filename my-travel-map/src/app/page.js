import Link from "next/link";
import styles from "./homepage.module.css";

export default function Home() {
  return (
    <div>
      <div className={styles.content}>
        <Link href="/map">
          Display Map
        </Link>
      </div>
    </div>
  );
}

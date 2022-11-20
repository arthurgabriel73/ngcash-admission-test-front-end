import styles from "../styles/login.module.css"

export default function Login() {
    return (
        <main className={styles.main}>
            <h1>NGCASH</h1>
            <form className={styles.container}>
                <input type="text"/>
                <input type="password"/>
                <input type="submit" value="login"/>
            </form>

        </main>
    )
}
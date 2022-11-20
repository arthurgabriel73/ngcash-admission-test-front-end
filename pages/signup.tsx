import styles from "../styles/signup.module.css"

export default function SignUp() {
    return (
        <main className={styles.main}>
            <h1>NGCASH</h1>
            <form className={styles.container}>
                <input type="text"/>
                <input type="password"/>
                <input type="submit" value="signup"/>
            </form>

        </main>
    )
}
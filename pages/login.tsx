import styles from "../styles/login.module.css"
import {FormEvent, useState} from "react";
import {useRouter} from "next/router";
import {dataProps} from "./signup";
import Link from "next/link";


export default function Login() {
    const router = useRouter()

    const [data, setData] = useState<dataProps>({
        username: "",
        password: "",
    })

    const [message, setMessage] = useState<string>("")

    async function loginUser(event: FormEvent) {
        event.preventDefault()

        await fetch(process.env.NEXT_PUBLIC_URL + 'auth/login', {
            method: "Post",
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(async (res) => {
            if (res.ok) {
                return res.json()
            } else {
                throw await res.json()
            }
        }).then(res => {
            localStorage.setItem("access_token", res["access_token"] )
            router.push("/")
        })
            .catch(res => {
            if (typeof res?.message != 'string') {
                setMessage(res?.message[0])
            } else {
                setMessage(res?.message)
            }
        })
    }

    return (
        <main className={styles.main}>
            <h1>NGCASH</h1>
            <form className={styles.container} onSubmit={loginUser}>
                <input type="text" placeholder="username" value={data.username}
                       onChange={(env) => setData({...data, username: env.target.value})}/>
                <input placeholder="password" type="password" value={data.password}
                       onChange={(env) => setData({...data, password: env.target.value})}/>
                <input type="submit" value="login"/>
                <p>Don't have an account? <Link href="/signup">SignUp</Link></p>
                <p>{message}</p>
            </form>

        </main>
    )
}
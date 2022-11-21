import styles from "../styles/signup.module.css"
import {FormEvent, useState} from "react";
import Link from "next/link";
import {useRouter} from "next/router";

export type dataProps = {
    username: string
    password: string
}

export default function SignUp() {
    const router = useRouter()

    const [data, setData] = useState<dataProps>({
        username: "",
        password: "",
    })

    const [message, setMessage] = useState<string>("")

    async function login() {
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

    async function createUser(event: FormEvent) {
        event.preventDefault()

        await fetch(process.env.NEXT_PUBLIC_URL + 'users/signup', {
            method: "Post",
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(async (res) => {
            if (res.ok) {
                setMessage("Account successfully created.")
                await login()
            } else {
                throw await res.json()
            }
        }).catch(res => {
            if (typeof res?.message != 'string') {
                setMessage(res?.message[0])
            } else {
                setMessage(res?.message)
            }
        })
    }

    return (
        <main className={styles.main}>
            <form className={styles.container} onSubmit={createUser}>
                <input className={styles.boxes} placeholder="username" type="text" value={data.username}
                       onChange={(env) => setData({...data, username: env.target.value})}/>
                <input className={styles.boxes} placeholder="password" type="password" value={data.password}
                       onChange={(env) => setData({...data, password: env.target.value})}/>
                <input className={styles.signup} type="submit" value="SIGN UP"/>
                <p className={styles.common}>Already have an account?  <Link className={styles.link} href="/login">Sign in</Link>.</p>
                <p className={styles.common}>{message}</p>
            </form>

        </main>
    )
}
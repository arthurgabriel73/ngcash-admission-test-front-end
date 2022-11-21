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
            <h1>NGCASH</h1>
            <form className={styles.container} onSubmit={createUser}>
                <input placeholder="username" type="text" value={data.username}
                       onChange={(env) => setData({...data, username: env.target.value})}/>
                <input placeholder="password" type="password" value={data.password}
                       onChange={(env) => setData({...data, password: env.target.value})}/>
                <input type="submit" value="signup"/>
                <p>If you are already registered, <Link href="/login">login</Link></p>
                <p>{message}</p>
            </form>

        </main>
    )
}
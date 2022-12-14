import Head from 'next/head'
import styles from '../styles/Home.module.css'
import {useRouter} from "next/router";
import {FormEvent, useEffect, useState} from "react";

export type transactionProps = {
    username: string
    value: string
}

export type getTransactionsProps = {
    day: string
    type: string
}

export type transactionsProps = {
    id: number
    debitedAccount: number
    creditedAccount: number
    value: number
    createdAt: string
}

export default function Home() {
    const router = useRouter()
    const [message, setMessage] = useState<string>("")
    const [balance, setBalance] = useState<string>("")

    const [transaction, setTransaction] = useState<transactionProps>({
        username: "",
        value: "",
    })

    const [filter, setFilter] = useState<getTransactionsProps>({
        day: "",
        type: "",
    })

    const [transactions, setTransactions] = useState<transactionsProps[]>([{
        id: 0,
        debitedAccount: 0,
        creditedAccount: 0,
        value: 0,
        createdAt: "",
    }])

    async function getBalance(): Promise<void> {
        await fetch(process.env.NEXT_PUBLIC_URL + 'accounts/balance', {
            method: "Get",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("access_token")
            }
        }).then(async (res) => {
            if (res.ok) {
                return res.json()
            } else {
                localStorage.removeItem("access_token")
                await router.push('/login')
            }
        }).then(res => {
            setBalance(res?.account_balance)
        })
    }

    async function transfer(event: FormEvent): Promise<void> {
        event.preventDefault()

        await fetch(process.env.NEXT_PUBLIC_URL + 'transactions/cashout/' + transaction.username , {
            method: "Post",
            body: JSON.stringify({value: Number(transaction.value)}),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("access_token")
            }
        }).then(async (res) => {
            if (res.ok) {
               setMessage('Transaction was successfully made.')
                await getBalance()
                await getTransactions()
            } else {
                throw await res.json()
            }
        }).catch(res => {
            setMessage(res?.message)
        })
    }

    async function getTransactions(): Promise<void> {
        const day = filter.day === ""? "":new Date(filter.day).getTime()

        await fetch(process.env.NEXT_PUBLIC_URL + 'transactions/self?day=' + day +
            '&type=' + filter.type, {
            method: "Get",
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("access_token")
            }
        }).then(async (res) => {
            if (res.ok) {
                return res.json()
            } else {
                throw await res.json()
            }
        }).then(res => {
            setTransactions(res)
        })
    }

    async function validateToken(): Promise<void> {
        await fetch(process.env.NEXT_PUBLIC_URL + 'auth/validate', {
            method: "Get",
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("access_token")
            }
        }).then(async (res) => {
            if (!res.ok) {
                localStorage.removeItem("access_token")
                await router.push('/login')
            }
        })
    }

    useEffect(() => {
        validateToken()
        getBalance()
    }, [])

    useEffect(() => {
        getBalance()
        getTransactions()
    }, [filter])

    const formatDate = (date:string) => {
        const formatDay = date.split("-")

        return formatDay[2] + "/" + formatDay[1] + "/" + formatDay[0]
    }

  return (
    <div className={styles.container}>
      <Head>
        <title>NGCASH | Financial</title>
      </Head>
        <main className={styles.main}>
            <p className={styles.actualBalance}>ACTUAL BALANCE</p>
            <p className={styles.common}>${balance}</p>
            <form className={styles.common} onSubmit={transfer} >
                <h1 className={styles.common}>Transaction</h1>
                <input className={styles.boxers} type="text" placeholder="name" value={transaction.username}
                       onChange={(env) => setTransaction({...transaction, username: env.target.value})}/>
                <input className={styles.boxers} type="number" placeholder="value" value={transaction.value}
                       onChange={(env) => setTransaction({...transaction, value: env.target.value})}/>
                <input className={styles.button} type="submit" value="Transfer"/>
            </form>
            <p className={styles.message}>{message}</p>

            <div className={styles.filters}>
                <h1 className={styles.common}>My Transactions</h1>
                <input className={styles.boxers} type="date" value={filter.day}
                       onChange={(env) => setFilter({...filter, day: env.target.value})}/>
                <select className={styles.boxers} value={filter.type}
                             onChange={(env) => setFilter({...filter, type: env.target.value})}>
                    <option value="cash-in">cash-in</option>
                    <option value="cash-out">cash-out</option>
                    <option value="none">none</option>
                </select>
            </div>

            <table>
                <tbody>
                    <tr>
                        <th className={styles.tables}>Debited Account</th>
                        <th className={styles.tables}>Credited Account</th>
                        <th className={styles.tables}>Value</th>
                        <th className={styles.tables}>Date</th>
                    </tr>
                    {transactions.map((_transaction: transactionsProps, index: number) => (
                        <tr key={index}>
                            <td>{_transaction.debitedAccount}</td>
                            <td>{_transaction.creditedAccount}</td>
                            <td>$ {_transaction.value}</td>
                            <td>{formatDate(_transaction.createdAt)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button className={styles.button} onClick={() => {
                localStorage.removeItem("access_token")
                router.push('/login')
            }}>logout</button>
        </main>
    </div>
  )
}

import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>NGCASH | Financial</title>
      </Head>
        <main>
            <p>3000</p>

            <form>
                <input type="text"/>
                <input type="number"/>
            </form>

            <div>
                <input type="text"/>
                <select>
                    <option>cash-in</option>
                    <option>cash-out</option>
                    <option>none</option>
                </select>
            </div>

            <table>
                <tr>
                    <th>Debited Account</th>
                    <th>Credited Account</th>
                    <th>Value</th>
                    <th>Date</th>
                </tr>
                <tr>
                    <td>7</td>
                    <td>9</td>
                    <td>33</td>
                    <td>2022-11-20</td>
                </tr>
            </table>
            <button>logout</button>
        </main>
    </div>
  )
}

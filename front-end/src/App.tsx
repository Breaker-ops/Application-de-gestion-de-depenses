import { useEffect, useState } from "react"
import api from "./api"
import toast from "react-hot-toast"
import { ArrowDownCircle, ArrowUpCircle, Wallet, Activity, TrendingUp, Trash, PlusCircle, TrendingDown } from "lucide-react"


type Transaction = {
  "id": string,
  "text": string,
  "amount": number,
  "created_at": string
}

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [text, setText] = useState<string>("")
  const [amount, setAmount] = useState<number | "">("")
  const [loading, setLoading] = useState(false)

  const getTransactions = async () => {
    try {
      const res = await api.get<Transaction[]>("transactions/")
      setTransactions(res.data)
      toast.success("Transactions chargées avec succès")
    }
    catch (error) {
      toast.error("Une erreur est survenue lors de la récupération des transactions" + error)
    }
  }

  const deleteTransaction = async (id: string) => {
    try {
      await api.delete(`transactions/${id}/`)
      toast.success("Transaction supprimé")
      getTransactions()
    }

    catch (error) {
      toast.error("Erreur de suppression" + error)
    }

  }
  const addTransactions = async () => {
    if (!text || amount == "" || isNaN(Number(amount))){
      toast.error("Merci de remplir tout les champs")
      return
    }

    setLoading(true)
    
    try {
      const res = await api.post<Transaction>("transactions/", {
        text,
        amount: Number(amount)
      })
      getTransactions()
      const modal = document.getElementById('my_modal_3') as HTMLDialogElement

      if (modal){
        modal.close()
      }
      toast.success("Transaction ajoutée avec succès")
      setText("")
      setAmount("")
    }
    catch (error) {
      toast.error("Une erreur est survenue lors de l'ajout de la transaction" + error)
    }
    finally{
      setLoading(false)
    }
  }

  useEffect(() => {
    getTransactions()
  }, [])

  const amounts = transactions.map((t) => Number(t.amount) || 0)
  const balance =
    amounts.reduce((acc, items) => acc + items, 0) || 0
  const revenue =
    amounts.filter((amount) => amount > 0).reduce((acc, items) => acc + items, 0) || 0
  const depense =
    amounts.filter((amount) => amount < 0).reduce((acc, items) => acc + items, 0) || 0
  const ratio = revenue > 0 ? Math.min(Math.abs((depense / revenue) * 100), 100) : 0
  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString(
      "FR-fr",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }
    );
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-2/3 flex flex-col gap-4">
        <div className="flex justify-between rounded-2xl border-2 border-warning/10 border-dashed bg-warning/5 p-5">
          <div className="flex flex-col gap-1">
            <div className="badge badge-soft">
              <Wallet className="w-4 h-4" />
              Votre solde
            </div>
            <div className="stat-value">
              {balance.toFixed(2)}F
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="badge badge-soft badge-success">
              <ArrowUpCircle className="w-4 h-4" />
              Revenus
            </div>
            <div className="stat-value">
              {revenue.toFixed(2)}F
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="badge badge-soft badge-error">
              <ArrowDownCircle className="w-4 h-4" />
              Dépenses
            </div>
            <div className="stat-value">
              {depense.toFixed(2)}F
            </div>
          </div>
        </div>

        <div className="rounded-2xl border-2 border-warning/10 border-dashed bg-warning/5 p-5">
          <div className="flex justify-between items-center mb-1">

            <div className="badge badge-soft badge-warning gap-1">
              <Activity />
              Dépenses VS Revenus
            </div>
            <div>{ratio.toFixed(0)}%</div>


          </div>

        </div>

        <progress className="progress progress-warning w-full"
          value={ratio}
          max={100}>

        </progress>

        <button className="btn btn-warning " onClick={() => (document.getElementById('my_modal_3') as HTMLDialogElement).showModal()}>
          <PlusCircle className="h-4 w-4" />
          Ajouter une transaction
        </button>
        <div className="overflow-x-auto rounded-2xl border-2 border-warning/10 border-dashed bg-warning/5">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th>#</th>
                <th>Description</th>
                <th>Montant</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, index) => (
                <tr key={t.id}>
                  <th>{index + 1}</th>
                  <td>{t.text}</td>
                  <td className="font-semibold flex items-center gap-2">{t.amount > 0 ? (
                    <TrendingUp className="text-success w-6 h-6" />
                  ) : (
                    <TrendingDown className="text-error w-6 h-6" />
                  )}

                    {t.amount > 0 ? `+ ${t.amount}` : `${t.amount}`}
                  </td>
                  <td>{formatDate(t.created_at)}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-soft btn-error"
                      title="Supprimer" onClick={() => deleteTransaction(t.id)}>
                      <Trash className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              )
              )}
            </tbody>
          </table>
        </div>

        <dialog id="my_modal_3" className="modal backdrop-blur">
          <div className="modal-box border-2 border-warning/10 border-dashed">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
            <h3 className="font-bold text-lg">Ajouter une transaction</h3>
              <div className="flex flex-col gap-4 mt-4">
                <div 
                className="flex flex-col gap-2"
                >
                  <label className="label">Texte</label>
                  <input type="text" 
                  name="text" 
                  value={text}
                  onChange={(e)=>setText(e.target.value)}
                  placeholder="Entrer le texte..."
                  className="input w-full" 
                  
                  />
                </div>
                <div 
                className="flex flex-col gap-2"
                >
                  <label className="label">
                    Montant(négatif - dépense, positif - revenu)
                  </label>
                  <input type="text" 
                  name="amount" 
                  value={amount}
                  onChange={(e)=>setAmount(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )}
                  placeholder="Entrer le montant..."
                  className="input w-full" 
                  
                  />
                </div>

                <button type="submit" 
                className="btn btn-warning w-full"
                onClick={addTransactions}
                disabled={loading}>
                  <PlusCircle className="h-4 w-4"/>
                  <span className="font-bold">Ajouter</span>
                </button>
              </div>
          </div>
        </dialog>
      </div>
    </div>
  )
}

export default App

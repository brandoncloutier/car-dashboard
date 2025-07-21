import { useState } from "react"
import { Plus, LayoutDashboard } from "lucide-react"

import Modal from '../Modal/Modal';
import NewDashboardForm from "./NewDashboardForm";

const FirstDashboardPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  return (
    <div className="flex h-full w-full items-center justify-center bg-background p-4">
      <div className="flex flex-col items-center space-y-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-2">
          <LayoutDashboard className="h-14 w-14 text-muted-foreground" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Create Your First Dashboard</h1>
          <p className="text-muted-foreground max-w-md">
            Get started by creating your first dashboard to organize and visualize your data.
          </p>
        </div>
        <button className="h-10 px-4 py-2 rounded-md bg-black text-white dark:bg-white dark:text-black hover:cursor-pointer" onClick={() => setIsModalOpen(true)}>Create Dashboard</button>
      </div>

      {/* MODAL */}
      <Modal isModalOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="sm" title="Create First Dashboard">
        <NewDashboardForm onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  )
}

export default FirstDashboardPage
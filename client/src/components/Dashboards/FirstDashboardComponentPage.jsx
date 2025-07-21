import { useState } from "react"
import { Plus, Component } from "lucide-react"

import Modal from '../Modal/Modal';
import AddFromComponentLibraryForm from "./AddFromComponentLibraryForm";

const FirstDashboardComponetPage = ({ dashboardId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  return (
    <div className="flex h-full w-full items-center justify-center bg-background p-4">
      <div className="flex flex-col items-center space-y-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-2">
          <Component className="h-14 w-14 text-muted-foreground" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Add Your First Component</h1>
          <p className="text-muted-foreground max-w-md">
            Add a componet for engine, statistics, media, etc.
          </p>
        </div>
        <button className="h-10 px-4 py-2 rounded-md bg-black text-white dark:bg-white dark:text-black hover:cursor-pointer" onClick={() => setIsModalOpen(true)}>Add Component</button>
      </div>

      {/* MODAL */}
      <Modal isModalOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="lg" title="Component Library">
        <AddFromComponentLibraryForm onClose={() => setIsModalOpen(false)} dashboardId={dashboardId} gridRowIndex={0}/>
      </Modal>
    </div>
  )
}

export default FirstDashboardComponetPage
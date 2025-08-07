import { useState, useEffect } from 'react'
import { Menu, PlaySquare, Plus } from "lucide-react"
import { RadialGauge } from 'canvas-gauges';
import { useSelector } from 'react-redux';

// Contexts
import { useWebSocketContext } from '../../contexts/WebSocketContext'
import { useSidebarContext } from '../../contexts/SidebarContext';

// Selectors
import { selectDashboards } from '../../features/dashboards/dashboardsSlice';

// Componets
import DashboardLayout from './DashboardLayout';
import FirstDashboardPage from './FirstDashboardPage';
import Modal from '../Modal/Modal';
import NewDashboardForm from './NewDashboardForm';
import { useEditModeContext } from '../../contexts/EditModeContext';
import { createPortal } from 'react-dom';

const DashboardsHome = () => {
  const dashboards = useSelector(selectDashboards)
  const { editMode } = useEditModeContext()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => {
    setIsModalOpen(true)
  }

  const RPMData = () => {
    const { watchResource, unwatchResource } = useWebSocketContext()
    useEffect(() => {
      watchResource("RPM")
      return () => unwatchResource("RPM");
    }, [watchResource, unwatchResource])

    const rpm = useSelector((state) => state.resources?.resources_data?.["RPM"] ?? 0)
    return (
      <div className='text-4xl'>{rpm}</div>
    )

  }

  return (
    <div className="flex flex-col h-full w-full">
      <main className='flex-1'>
        {dashboards.length ? <DashboardLayout dashboards={dashboards} /> : <FirstDashboardPage />}
      </main>
      {editMode ? createPortal(<Plus className='w-full h-full border-2 border-black dark:border-white rounded hover:bg-gray-200 hover:dark:bg-gray-700 hover:cursor-pointer' onClick={openModal}/>, document.getElementById("sidebar-add-button-root")) : null}

      <Modal isModalOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="sm" title="Create New Dashboard">
        <NewDashboardForm onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  )
}

export default DashboardsHome
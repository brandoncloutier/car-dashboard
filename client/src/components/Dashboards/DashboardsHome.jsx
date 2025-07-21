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
import { EditModeProvider, useEditModeContext } from '../../contexts/EditModeContext';

const DashboardsHome = () => {
  const dashboards = useSelector(selectDashboards)

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
      <Header dashboards={dashboards}/>
      <main className='flex-1'>
        {dashboards.length ? <DashboardLayout dashboards={dashboards} /> : <FirstDashboardPage />}
      </main>
    </div>
  )
}

const Header = ({ dashboards }) => {
  const { handleSidebarToggle } = useSidebarContext()
  const { editMode } = useEditModeContext()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => {
    setIsModalOpen(true)
  }
  return (
    <>
      <div className='w-full border-b-gray-200 dark:border-b-gray-700 flex h-12 items-center justify-between'>
        <div className="flex items-center gap-2">
          <div className='text-lg'>Dashboards</div>
        </div>
        <div className="items-center mr-2">
          {dashboards.length && editMode ?
            <button className='flex items-center gap-1 bg-gray-200 dark:bg-gray-700 py-[4px] px-[14px] rounded hover:cursor-pointer' onClick={openModal}>
              <span>New</span>
              <Plus className='h-4 w-4' />
            </button> : null}
        </div>
      </div>

      <Modal isModalOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="sm" title="Create New Dashboard">
        <NewDashboardForm onClose={() => setIsModalOpen(false)} />
      </Modal>
    </>
  )
}

export default DashboardsHome
import { useParams } from "react-router"
import { useSelector, useDispatch } from "react-redux"
import { Menu, Plus, ChevronDown, ChevronRight, X } from "lucide-react";
import { useState } from "react";
import { componentMap } from "../../utils/componentsLibrary";
import { useEditModeContext } from "../../contexts/EditModeContext";
import FirstDashboardComponetPage from "./FirstDashboardComponentPage";
import AddFromComponentLibraryForm from "./AddFromComponentLibraryForm";
import Modal from "../Modal/Modal";
import { deleteComponentFromDashboard } from "../../features/dashboards/dashboardsSlice";

const Header = ({ name }) => {
  const { editMode } = useEditModeContext()
  return (
    <div className={`w-full border-b ${ editMode ? "border-gray-200 dark:border-gray-700" : "border-b-transparent"} flex h-12 items-center justify-between`}>
      <div className="flex items-center gap-2">
        <div className='text-lg'>{name}</div>
      </div>
    </div>
  )
}

const Dashboard = () => {
  const { id } = useParams()

  const dashboard = useSelector(state => state.dashboards.dashboards.find((dashboard) => dashboard.id === id))

  if (!dashboard) return <div>No Dashboard Exists</div>

  return (
    <div className="flex flex-col h-full w-full">
      <Header name={dashboard.name} />
      {dashboard.grid.length > 0 ? <DashboardGrid grid={dashboard.grid} dashboardId={dashboard.id}/> : <FirstDashboardComponetPage dashboardId={dashboard.id} />}
    </div>
  )
}

const DashboardGrid = ({ dashboardId, grid }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { editMode } = useEditModeContext()

  const handleClick = () => {
    setIsModalOpen(true)
  }
  return (
    <div className={`flex flex-col divide-y ${editMode ? "divide-gray-200 dark:divide-gray-700" : "divide-transparent"} grow`}>
      {grid.map((row, index) => <DashboardGridRow row={row} key={index} dashboardId={dashboardId} gridRowIndex={index}/>)}
      {editMode ? <button className="flex justify-center h-[30px] items-center hover:cursor-pointer hover:bg-gray-200 hover:dark:bg-gray-700 shrink-0" onClick={handleClick}><ChevronDown/></button> : null}

      <Modal isModalOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="lg" title="Component Library">
        <AddFromComponentLibraryForm onClose={() => setIsModalOpen(false)} dashboardId={dashboardId} gridRowIndex={grid.length}/>
      </Modal>
    </div>
  )
}

const DashboardGridRow = ({ dashboardId, row, gridRowIndex }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { editMode } = useEditModeContext()

  const handleClick = () => {
    setIsModalOpen(true)
  }

  return (
    <div className="h-full flex">
      <div className={`grid [grid-template-columns:repeat(auto-fit,minmax(0,1fr))] divide-x h-full grow ${editMode ? "border-r border-r-gray-200 dark:border-r-gray-700 divide-gray-200 dark:divide-gray-700" : "divide-transparent"}`}>
        {row.map((componentId, index) => <DashboardComponent componentId={componentId} key={index} gridRowIndex={gridRowIndex} gridColIndex={index} dashboardId={dashboardId}/>)}
      </div>
      {editMode ? <button className="flex justify-center w-[30px] items-center hover:cursor-pointer hover:bg-gray-200 hover:dark:bg-gray-700 shrink-0" onClick={handleClick}><ChevronRight /></button> : null}

      <Modal isModalOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="lg" title="Component Library">
        <AddFromComponentLibraryForm onClose={() => setIsModalOpen(false)} dashboardId={dashboardId} gridRowIndex={gridRowIndex}/>
      </Modal>
    </div>
  )
}

const DashboardComponent = ({ dashboardId, componentId, gridRowIndex, gridColIndex }) => {
  const { editMode } = useEditModeContext()
  const dispatch = useDispatch()

  const handleDelete = () => {
    dispatch(deleteComponentFromDashboard({ dashboardId, gridRowIndex, gridColIndex }))
    console.log("deleting:" + gridRowIndex + " : " + gridColIndex)
  }
  return (
    <div className="relative">
    {componentMap[componentId]}
    {editMode ? <button className="absolute top-2 right-2 bg-red-600 rounded-full hover:cursor-pointer p-[2px]" onClick={handleDelete}><X className="w-4 h-4"/></button> : null}
    </div>
  )
}

export default Dashboard
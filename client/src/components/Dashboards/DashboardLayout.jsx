import DashboardWidget from "./DashboardWidget"

const DashboardLayout = ({ dashboards }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
      {dashboards.map(dashboard => <DashboardWidget key={dashboard.id} dashboard={dashboard}/>)}
    </div>
  )
}

export default DashboardLayout
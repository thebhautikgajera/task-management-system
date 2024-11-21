import PropTypes from 'prop-types';
import Header from '../Others/Header'
import Tasklist from '../TaskList/Tasklist'

const EmployeeDashboard = ({ loggedInUser }) => {
  return (
    <>
      <div className="sticky top-0 z-50">
        <Header loggedInUser={loggedInUser} />
      </div>
      <Tasklist loggedInUser={loggedInUser} />
    </>
  )
}

EmployeeDashboard.propTypes = {
  loggedInUser: PropTypes.shape({
    id: PropTypes.string.isRequired
  }).isRequired
};

export default EmployeeDashboard
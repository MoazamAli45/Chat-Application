import PropTypes from "prop-types";
const NotificationBadge = ({ children, count }) => {
  return (
    <button
      className="py-4 px-1 relative border-2 border-transparent text-gray-800 rounded-full hover:text-gray-400 focus:outline-none focus:text-gray-500 transition duration-150 ease-in-out"
      aria-label="notifications"
    >
      {children}
      {count ? (
        <span className="absolute inset-0 object-right-top -mr-6">
          {count && (
            <div className="inline-flex items-center px-1.5 py-0.5 border-2 border-white rounded-full text-xs font-semibold leading-4 bg-red-500 text-white">
              {count !== "0" && count}
            </div>
          )}
        </span>
      ) : (
        <></>
      )}
    </button>
  );
};

export default NotificationBadge;

NotificationBadge.propTypes = {
  children: PropTypes.node.isRequired,
  count: PropTypes.number.isRequired,
};

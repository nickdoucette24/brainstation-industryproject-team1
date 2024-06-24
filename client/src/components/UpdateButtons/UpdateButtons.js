import "./UpdateButtons.scss";

const UpdateButtons = ({ handleSubmit, handleClear }) => {
  return (
    <div className="update-buttons__container">
      <button
        type="submit"
        onClick={handleSubmit}
        className="update-save__button"
      >
        Save
      </button>
      <button
        type="button"
        onClick={handleClear}
        className="update-cancel__button"
      >
        Cancel
      </button>
    </div>
  );
};

export default UpdateButtons;

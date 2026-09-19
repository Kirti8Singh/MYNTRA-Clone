import { useDispatch, useSelector } from "react-redux";
import { profileActions } from "../store/profileSlice";

const Profile = () => {
  const dispatch = useDispatch();

  const profile = useSelector((store) => store.profile);

  const isEditing = !profile.isSaved;

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    dispatch(
      profileActions.updateProfile({
        [name]: value,
      })
    );
  };

  const handleSaveProfile = () => {
    dispatch(profileActions.saveProfile());
  };

  const handleEditProfile = () => {
    dispatch(profileActions.editProfile());
  };

  const concerns = [
    "Acne",
    "Pigmentation",
    "Dryness",
    "Aging",
    "Dullness",
    "Sensitivity",
  ];

  const brands = [
    "COSRX",
    "The Ordinary",
    "Minimalist",
    "CeraVe",
    "La Roche-Posay",
    "SkinCeuticals",
  ];

  if (!isEditing) {
    return (
      <main className="profile-page">

        <div className="profile-header">
          <h1>My Profile</h1>
          <p>
            Your personal and skincare preferences.
          </p>
        </div>

        {/* Profile Summary */}
        <section className="profile-summary-card">

          <div className="profile-summary-top">
            <div className="profile-avatar">
              <span
                className="material-symbols-outlined"
                aria-hidden="true"
              >
                person
              </span>
            </div>

            <div>
              <h2>{profile.name || "Your Profile"}</h2>
              <p>{profile.email || "No email added"}</p>
            </div>
          </div>

          <div className="profile-summary-divider"></div>

          {/* Basic Information */}
          <div className="profile-summary-section">
            <h3>Basic Information</h3>

            <div className="profile-summary-grid">

              <div className="profile-summary-item">
                <span className="profile-summary-label">
                  Name
                </span>
                <span className="profile-summary-value">
                  {profile.name || "Not provided"}
                </span>
              </div>

              <div className="profile-summary-item">
                <span className="profile-summary-label">
                  Email
                </span>
                <span className="profile-summary-value">
                  {profile.email || "Not provided"}
                </span>
              </div>

              <div className="profile-summary-item">
                <span className="profile-summary-label">
                  Phone
                </span>
                <span className="profile-summary-value">
                  {profile.phone || "Not provided"}
                </span>
              </div>

            </div>
          </div>

          <div className="profile-summary-divider"></div>

          {/* Skin Profile */}
          <div className="profile-summary-section">
            <h3>Skin Profile</h3>

            <div className="profile-summary-grid">

              <div className="profile-summary-item">
                <span className="profile-summary-label">
                  Skin Type
                </span>

                <span className="profile-summary-value">
                  {profile.skinType || "Not selected"}
                </span>
              </div>

              <div className="profile-summary-item">
                <span className="profile-summary-label">
                  Product Budget
                </span>

                <span className="profile-summary-value">
                  {profile.budget === "all"
                    ? "No preference"
                    : profile.budget === "under500"
                    ? "Under ₹500"
                    : profile.budget === "500to1500"
                    ? "₹500 – ₹1500"
                    : profile.budget === "1500to3000"
                    ? "₹1500 – ₹3000"
                    : "Above ₹3000"}
                </span>
              </div>

            </div>

            <div className="profile-summary-item profile-summary-full">
              <span className="profile-summary-label">
                Skin Concerns
              </span>

              <div className="profile-tags">
                {profile.concerns.length > 0 ? (
                  profile.concerns.map((concern) => (
                    <span
                      key={concern}
                      className="profile-tag"
                    >
                      {concern}
                    </span>
                  ))
                ) : (
                  <span className="profile-summary-value">
                    No concerns selected
                  </span>
                )}
              </div>
            </div>

            <div className="profile-summary-item profile-summary-full">
              <span className="profile-summary-label">
                Skincare Goals
              </span>

              <span className="profile-summary-value">
                {profile.skinGoals || "No goals added"}
              </span>
            </div>
          </div>

          <div className="profile-summary-divider"></div>

          {/* Preferred Brands */}
          <div className="profile-summary-section">
            <h3>Preferred Brands</h3>

            <div className="profile-tags">
              {profile.preferredBrands.length > 0 ? (
                profile.preferredBrands.map((brand) => (
                  <span
                    key={brand}
                    className="profile-tag"
                  >
                    {brand}
                  </span>
                ))
              ) : (
                <span className="profile-summary-value">
                  No preferred brands selected
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            className="profile-edit-button"
            onClick={handleEditProfile}
          >
            <span
              className="material-symbols-outlined"
              aria-hidden="true"
            >
              edit
            </span>

            Edit Profile
          </button>

        </section>
      </main>
    );
  }

  return (
    <main className="profile-page">

      <div className="profile-header">
        <h1>My Profile</h1>
        <p>
          Tell us about yourself and your skin so we can
          personalize your skincare experience.
        </p>
      </div>

      {/* Basic Information */}
      <section className="profile-section">
        <h2>Basic Information</h2>

        <div className="profile-form-grid">

          <div className="profile-form-group">
            <label htmlFor="profile-name">
              Name
            </label>

            <input
              id="profile-name"
              name="name"
              type="text"
              value={profile.name}
              onChange={handleInputChange}
              placeholder="Enter your name"
            />
          </div>

          <div className="profile-form-group">
            <label htmlFor="profile-email">
              Email
            </label>

            <input
              id="profile-email"
              name="email"
              type="email"
              value={profile.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
            />
          </div>

          <div className="profile-form-group">
            <label htmlFor="profile-phone">
              Phone Number
            </label>

            <input
              id="profile-phone"
              name="phone"
              type="tel"
              value={profile.phone}
              onChange={handleInputChange}
              placeholder="Enter your phone number"
            />
          </div>

        </div>
      </section>

      {/* Skin Profile */}
      <section className="profile-section">
        <h2>Skin Profile</h2>

        <fieldset>
          <legend>What is your skin type?</legend>

          <div className="profile-options">

            {[
              "Dry",
              "Oily",
              "Combination",
              "Normal",
              "Sensitive",
            ].map((type) => (
              <label
                key={type}
                className="profile-option"
              >
                <input
                  type="radio"
                  name="skinType"
                  value={type}
                  checked={profile.skinType === type}
                  onChange={handleInputChange}
                />

                <span>{type}</span>
              </label>
            ))}

          </div>
        </fieldset>
      </section>

      {/* Skin Concerns */}
      <section className="profile-section">
        <fieldset>
          <legend>What are your main skin concerns?</legend>

          <div className="profile-options">

            {concerns.map((concern) => (
              <label
                key={concern}
                className="profile-option"
              >
                <input
                  type="checkbox"
                  checked={profile.concerns.includes(concern)}
                  onChange={() =>
                    dispatch(
                      profileActions.toggleConcern(concern)
                    )
                  }
                />

                <span>{concern}</span>
              </label>
            ))}

          </div>
        </fieldset>
      </section>

      {/* Skin Goals */}
      <section className="profile-section">
        <div className="profile-form-group">

          <label htmlFor="skin-goals">
            What are your skincare goals?
          </label>

          <textarea
            id="skin-goals"
            name="skinGoals"
            value={profile.skinGoals}
            onChange={handleInputChange}
            placeholder="Tell us what you want to achieve with your skincare routine..."
            rows="4"
          />

        </div>
      </section>

      {/* Budget */}
      <section className="profile-section">

        <div className="profile-form-group">

          <label htmlFor="budget">
            Preferred Product Budget
          </label>

          <select
            id="budget"
            name="budget"
            value={profile.budget}
            onChange={handleInputChange}
          >
            <option value="all">
              No preference
            </option>

            <option value="under500">
              Under ₹500
            </option>

            <option value="500to1500">
              ₹500 – ₹1500
            </option>

            <option value="1500to3000">
              ₹1500 – ₹3000
            </option>

            <option value="above3000">
              Above ₹3000
            </option>
          </select>

        </div>

      </section>

      {/* Preferred Brands */}
      <section className="profile-section">

        <fieldset>
          <legend>Preferred Brands</legend>

          <div className="profile-options">

            {brands.map((brand) => (
              <label
                key={brand}
                className="profile-option"
              >
                <input
                  type="checkbox"
                  checked={profile.preferredBrands.includes(brand)}
                  onChange={() =>
                    dispatch(
                      profileActions.toggleBrand(brand)
                    )
                  }
                />

                <span>{brand}</span>
              </label>
            ))}

          </div>
        </fieldset>

      </section>

      <button
        type="button"
        className="profile-save-button"
        onClick={handleSaveProfile}
      >
        Save Profile
      </button>

    </main>
  );
};

export default Profile;
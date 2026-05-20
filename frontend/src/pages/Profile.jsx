import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TopBar from "../components/TopBar";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import { API_BASE } from "../config/api";
import "../styles/joinnow.css";
import "../styles/profile.css";

const MAX_IMAGE_BYTES = 450_000;

function initials(user) {
  const a = (user.firstName || "").trim()[0] || "";
  const b = (user.lastName || "").trim()[0] || "";
  if (a || b) return (a + b).toUpperCase();
  return (user.email || "?").slice(0, 2).toUpperCase();
}

function formatDateForInput(value) {
  if (!value) return "";
  const s = String(value);
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

function applyUserToFormState(user) {
  return {
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    phoneNumber: user.phoneNumber || "",
    zipCode: user.zipCode || "",
    country: user.country || "",
    birthDate: formatDateForInput(user.birthDate),
    email: user.email || "",
    previewUrl: user.profileImageUrl || null,
    profileImageUrl: user.profileImageUrl || null,
  };
}

function getChangedProfileFields(current, original) {
  const changed = {};
  const fields = [
    "firstName",
    "lastName",
    "phoneNumber",
    "zipCode",
    "country",
    "birthDate",
  ];

  for (const key of fields) {
    if ((current[key] || "") !== (original[key] || "")) {
      changed[key] = current[key] || null;
    }
  }

  const origPic = original.profileImageUrl ?? null;
  const currPic = current.profileImageUrl ?? null;
  if (currPic !== origPic) {
    changed.profileImageUrl = currPic;
  }

  return changed;
}

function ProfileEditor({ user, refreshUser }) {
  const init = applyUserToFormState(user);
  const [initialValues, setInitialValues] = useState(init);
  const [firstName, setFirstName] = useState(init.firstName);
  const [lastName, setLastName] = useState(init.lastName);
  const [phoneNumber, setPhoneNumber] = useState(init.phoneNumber);
  const [zipCode, setZipCode] = useState(init.zipCode);
  const [country, setCountry] = useState(init.country);
  const [birthDate, setBirthDate] = useState(init.birthDate);
  const [email] = useState(init.email);
  const [previewUrl, setPreviewUrl] = useState(init.previewUrl);
  const [profileImageUrl, setProfileImageUrl] = useState(init.profileImageUrl);

  useEffect(() => {
    const next = applyUserToFormState(user);
    setInitialValues(next);
    setFirstName(next.firstName);
    setLastName(next.lastName);
    setPhoneNumber(next.phoneNumber);
    setZipCode(next.zipCode);
    setCountry(next.country);
    setBirthDate(next.birthDate);
    setPreviewUrl(next.previewUrl);
    setProfileImageUrl(next.profileImageUrl);
  }, [user]);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const onPickImage = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !file.type.startsWith("image/")) {
      setMessage({ type: "error", text: "Please choose an image file." });
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setMessage({
        type: "error",
        text: "Image is too large. Try one under about 400 KB.",
      });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result;
      if (typeof url === "string" && url.length > 500_000) {
        setMessage({ type: "error", text: "That image is still too large." });
        return;
      }
      setPreviewUrl(url);
      setProfileImageUrl(url);
      setMessage({ type: "", text: "" });
    };
    reader.readAsDataURL(file);
  };

  const clearPhoto = () => {
    setPreviewUrl(null);
    setProfileImageUrl(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    const currentValues = {
      firstName,
      lastName,
      phoneNumber,
      zipCode,
      country,
      birthDate: birthDate || null,
      profileImageUrl: profileImageUrl ?? null,
    };

    const body = getChangedProfileFields(currentValues, initialValues);

    if (Object.keys(body).length === 0) {
      setMessage({ type: "ok", text: "No changes to save." });
      setSaving(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/auth/profile`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setMessage({
          type: "error",
          text: data.message || "Could not save profile.",
        });
        return;
      }

      const refreshed = await refreshUser();
      const u = refreshed ?? data.user;
      if (u) {
        const next = applyUserToFormState(u);
        setInitialValues(next);
        setFirstName(next.firstName);
        setLastName(next.lastName);
        setPhoneNumber(next.phoneNumber);
        setZipCode(next.zipCode);
        setCountry(next.country);
        setBirthDate(next.birthDate);
        setPreviewUrl(next.previewUrl);
        setProfileImageUrl(next.profileImageUrl);
      }
      setMessage({ type: "ok", text: "Profile saved." });
    } catch {
      setMessage({ type: "error", text: "Network error. Try again." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="join-main">
      <section className="join-card">
        <div className="join-form-section">
          <div className="join-form-intro">
            <p className="join-cursive">Your account</p>
            <h1>My profile</h1>
          </div>

          {message.type === "error" && message.text && (
            <div className="error-banner">{message.text}</div>
          )}
          {message.type === "ok" && message.text && (
            <div className="profile-success-banner">{message.text}</div>
          )}

          <form className="join-form" onSubmit={handleSubmit}>
            <h2 className="join-section-title">Profile photo</h2>

            <div className="profile-avatar-row">
              <div className="profile-avatar-preview">
                {previewUrl ? (
                  <img src={previewUrl} alt="" />
                ) : (
                  <span>{initials(user)}</span>
                )}
              </div>
              <div className="profile-avatar-actions">
                <label className="profile-upload-label">
                  Upload photo
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={onPickImage}
                  />
                </label>
                {(previewUrl || user.profileImageUrl) && (
                  <button
                    type="button"
                    className="profile-remove-photo"
                    onClick={clearPhoto}
                  >
                    Remove photo
                  </button>
                )}
              </div>
            </div>

            <h2 className="join-section-title">Your details</h2>

            <div className="join-grid-two">
              <div className="join-field">
                <label htmlFor="pf-first">First name</label>
                <input
                  id="pf-first"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  autoComplete="given-name"
                />
              </div>
              <div className="join-field">
                <label htmlFor="pf-last">Last name</label>
                <input
                  id="pf-last"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  autoComplete="family-name"
                />
              </div>
            </div>

            <div className="join-field">
              <label htmlFor="pf-email">Email</label>
              <input id="pf-email" value={email} disabled readOnly />
            </div>

            <div className="join-grid-two">
              <div className="join-field">
                <label htmlFor="pf-phone">Phone</label>
                <input
                  id="pf-phone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  autoComplete="tel"
                />
              </div>
              <div className="join-field">
                <label htmlFor="pf-zip">Zip / postal code</label>
                <input
                  id="pf-zip"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  autoComplete="postal-code"
                />
              </div>
            </div>

            <div className="join-grid-two">
              <div className="join-field">
                <label htmlFor="pf-country">Country</label>
                <input
                  id="pf-country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  autoComplete="country-name"
                />
              </div>
              <div className="join-field">
                <label htmlFor="pf-birth">Date of birth</label>
                <input
                  id="pf-birth"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="join-primary-btn"
              disabled={saving}
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          </form>
        </div>

        <aside className="join-info-section">
          <div className="join-info-inner">
            <p className="join-cursive">Next step</p>
            <h2>Book your stay</h2>
            <p>
              Browse rooms and offers, then reserve your dates when you are
              ready.
            </p>
            <Link to="/booking" className="join-secondary-btn">
              Go to booking
            </Link>
            <Link to="/" className="join-secondary-btn profile-aside-link-alt">
              Back to homepage
            </Link>
          </div>
        </aside>
      </section>
    </main>
  );
}

function Profile() {
  const { user, loading, refreshUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [loading, user, navigate]);

  if (loading || !user) {
    return (
      <div className="join-page">
        <TopBar />
        <Header />
        <main className="join-main">
          <p className="profile-loading">Loading…</p>
        </main>
      </div>
    );
  }

  return (
    <div className="join-page">
      <TopBar />
      <Header />
      <ProfileEditor key={user.userId} user={user} refreshUser={refreshUser} />
    </div>
  );
}

export default Profile;

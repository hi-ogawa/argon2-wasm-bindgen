use argon2::{password_hash::Salt, Argon2, PasswordHash, PasswordHasher, PasswordVerifier};
use password_hash::Error;
use wasm_bindgen::{prelude::wasm_bindgen, JsError};

#[wasm_bindgen]
pub fn hash_password_simple(password: String, salt_b64: String) -> Result<String, JsError> {
    let salt =
        Salt::from_b64(&salt_b64).map_err(|e| JsError::new(&format!("[Salt::from_b64] {}", e)))?;

    let instance = Argon2::default();
    let password_hash = instance
        .hash_password(password.as_bytes(), salt)
        .map_err(|e| JsError::new(&format!("[Argon2::hash_password] {}", e)))?;

    Ok(password_hash.to_string())
}

#[wasm_bindgen]
pub fn verify_password(password: String, password_hash: String) -> Result<bool, JsError> {
    let parsed_password_hash = PasswordHash::new(&password_hash)
        .map_err(|e| JsError::new(&format!("[PasswordHash::new] {}", e)))?;

    // not throw for Error::Password
    let result = Argon2::default().verify_password(password.as_bytes(), &parsed_password_hash);
    match result {
        Ok(()) => Ok(true),
        Err(Error::Password) => Ok(false),
        Err(e) => Err(JsError::new(&format!("[Argon2::verify_password] {}", e))),
    }
}

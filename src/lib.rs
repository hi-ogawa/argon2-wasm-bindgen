use argon2::{password_hash::Salt, Argon2, PasswordHasher};
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

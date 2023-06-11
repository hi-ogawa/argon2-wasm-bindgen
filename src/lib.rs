use argon2::{
    password_hash::Salt, Algorithm, Argon2, ParamsBuilder, PasswordHash, PasswordHasher,
    PasswordVerifier, Version,
};
use password_hash::Error;
use wasm_bindgen::{prelude::wasm_bindgen, JsError};

#[wasm_bindgen]
pub fn hash_password(
    password: String,
    salt_b64: String,
    algorithm: Option<String>,
    version: Option<u32>,
    m_cost: Option<u32>,
    t_cost: Option<u32>,
    p_cost: Option<u32>,
) -> Result<String, JsError> {
    let salt =
        Salt::from_b64(&salt_b64).map_err(|e| JsError::new(&format!("[Salt::from_b64] {}", e)))?;

    let algorithm = match algorithm {
        Some(v) => {
            Algorithm::new(&v).map_err(|e| JsError::new(&format!("[Algorithm::new] {}", e)))?
        }
        None => Algorithm::default(),
    };

    let version = match version {
        Some(v) => {
            Version::try_from(v).map_err(|e| JsError::new(&format!("[Version::try_from] {}", e)))?
        }
        None => Version::default(),
    };

    let mut params_builder = ParamsBuilder::new();
    if let Some(v) = m_cost {
        params_builder.m_cost(v);
    }
    if let Some(v) = t_cost {
        params_builder.t_cost(v);
    }
    if let Some(v) = p_cost {
        params_builder.p_cost(v);
    }
    let params = params_builder
        .build()
        .map_err(|e| JsError::new(&format!("[ParamsBuilder::build] {}", e)))?;

    // hash
    let password_hash = Argon2::new(algorithm, version, params)
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

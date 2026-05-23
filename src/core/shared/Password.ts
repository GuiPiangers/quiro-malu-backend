import { ApiError } from '../../utils/ApiError'
import { Crypto } from './helpers/Crypto'

const BCRYPT_HASH_RE = /^\$2[aby]?\$\d{2}\$/

function isStoredPasswordHash(value: string): boolean {
  return BCRYPT_HASH_RE.test(value) && value.length >= 59
}

export class Password {
  private readonly isStoredHash: boolean

  constructor(readonly value: string) {
    this.isStoredHash = isStoredPasswordHash(value)
    if (this.isStoredHash) {
      return
    }

    if (value.length < 5) {
      throw new ApiError(
        'A senha deve conter pelo menos 5 caracteres',
        400,
        'password',
      )
    }

    if (!value.match(/[A-Z]/)) {
      throw new ApiError(
        'A senha deve conter pelo menos uma letra maiúscula',
        400,
        'password',
      )
    }

    if (!value.match(/[0-9!"#$%&'(.)*+,/:;<=>?@[\]^_`{|}~-]/)) {
      throw new ApiError(
        'A senha deve conter pelo menos um número ou carácter especial',
        400,
        'password',
      )
    }
  }

  async getHash() {
    if (this.isStoredHash) {
      return this.value
    }
    const hash = await Crypto.createRandomHash(this.value)
    return hash
  }
}

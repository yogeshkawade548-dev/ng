using System.Security.Cryptography;
using System.Text;
using Newtonsoft.Json;

namespace Api_09.Helpers
{
    public static class EncryptionHelper
    {
        private static readonly string SecretKey = "MySecretKey123!@#00000000000000000".Substring(0, 32);

        public static string Encrypt(object data)
        {
            try
            {
                var jsonString = JsonConvert.SerializeObject(data);
                var keyBytes = Encoding.UTF8.GetBytes(SecretKey);
                var dataBytes = Encoding.UTF8.GetBytes(jsonString);

                using (var aes = Aes.Create())
                {
                    aes.Key = keyBytes;
                    aes.Mode = CipherMode.CBC;
                    aes.Padding = PaddingMode.PKCS7;
                    aes.GenerateIV();
                    
                    using (var encryptor = aes.CreateEncryptor())
                    {
                        var encrypted = encryptor.TransformFinalBlock(dataBytes, 0, dataBytes.Length);
                        var result = new byte[aes.IV.Length + encrypted.Length];
                        Array.Copy(aes.IV, 0, result, 0, aes.IV.Length);
                        Array.Copy(encrypted, 0, result, aes.IV.Length, encrypted.Length);
                        return Convert.ToBase64String(result);
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Encryption error: {ex.Message}");
                return JsonConvert.SerializeObject(data);
            }
        }

        public static T Decrypt<T>(string encryptedData)
        {
            try
            {
                var keyBytes = Encoding.UTF8.GetBytes(SecretKey);
                var dataBytes = Convert.FromBase64String(encryptedData);

                using (var aes = Aes.Create())
                {
                    aes.Key = keyBytes;
                    aes.Mode = CipherMode.CBC;
                    aes.Padding = PaddingMode.PKCS7;
                    
                    var iv = new byte[16];
                    Array.Copy(dataBytes, 0, iv, 0, 16);
                    aes.IV = iv;

                    var encrypted = new byte[dataBytes.Length - 16];
                    Array.Copy(dataBytes, 16, encrypted, 0, encrypted.Length);

                    using (var decryptor = aes.CreateDecryptor())
                    {
                        var decrypted = decryptor.TransformFinalBlock(encrypted, 0, encrypted.Length);
                        var jsonString = Encoding.UTF8.GetString(decrypted);
                        return JsonConvert.DeserializeObject<T>(jsonString);
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Decryption error: {ex.Message}");
                return JsonConvert.DeserializeObject<T>(encryptedData);
            }
        }
    }
}
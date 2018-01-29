using System.Security.Cryptography;
using static System.Console;

public static string CreatePin(int length)
{
    using (var randomizer = new RNGCryptoServiceProvider())
    {

        var pin = "";
        var bytes = new byte[1];
        for (var i = 0; i < length; i++)
        {
            while (true)
            {
                randomizer.GetBytes(bytes);
                if (bytes[0] < 10)
                {
                    pin += bytes[0];
                    break;
                }
            }
        }
        return pin;
    }
}

var pin = CreatePin(4);
WriteLine(pin);
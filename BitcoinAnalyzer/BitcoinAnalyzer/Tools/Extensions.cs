namespace BitcoinAnalyzer.Tools
{
    public static class Extensions
    {
        public static int Mod(this int x, int y)
        {
            var rem = x % y;
            return rem < 0 ? rem + y : rem;
        }
    }
}

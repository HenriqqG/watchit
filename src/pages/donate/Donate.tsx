import { motion } from "framer-motion";
import { useLanguage } from "../../contexts/LanguageContext";
import { tl } from "../../translations/translation";
import { Button, Table } from "@radix-ui/themes";
import qrPix from "../../assets/donations/QRCodeInter.png";

export default function Donate() {
    const { currentLanguage } = useLanguage();

    return (
        <main className="w-full min-h-screen flex flex-col items-center text-white bg-gradient-to-b via-[#121212] to-[#1a1a1a] overflow-hidden pb-20">
            <motion.section
                className="flex flex-col items-center text-center px-6 mt-24 max-w-3xl"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}>
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-orange-400">
                    {tl(currentLanguage, "donate.title")}
                </h1>
                <p className="text-lg text-gray-400 leading-relaxed max-w-2xl">
                    {tl(currentLanguage, "donate.description")}
                </p>
            </motion.section>

            <motion.div
                className="flex flex-col items-center bg-[#181818] p-6 rounded-2xl border border-[#2a2a2a] shadow-xl mt-14 max-w-sm"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}>
                <img
                    src={qrPix}
                    alt="QR Code Pix - Banco Inter"
                    className="w-70 h-auto rounded-lg shadow-[0_0_25px_rgba(255,120,0,0.25)]"/>
                <div className="mt-4 text-center">
                    <h3 className="text-lg font-semibold text-orange-400 mb-1">
                        Pix — Banco Inter
                    </h3>
                    <p className="text-gray-400 text-sm mb-2">
                        {tl(currentLanguage, "donate.qr_instructions")}
                    </p>
                    <div className="bg-[#222] text-sm text-gray-300 px-4 py-2 rounded-lg font-mono select-all">
                        03b17140-405d-4043-9121-efe248ea9a35
                    </div>
                    <p className="text-gray-500 text-xs mt-2">
                        Titular:{" "}
                        <span className="text-gray-300 font-medium">
                            Henrique Gagno Porto
                        </span>
                    </p>
                </div>
            </motion.div>

            <p className="text-gray-500 text-lg mt-8">
                <span className="text-orange-400 font-medium">
                    {tl(currentLanguage, "donate.or")}
                </span>
            </p>

            <motion.div
                className="mt-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}>
                <Button
                    size="4"
                    radius="large"
                    color="orange"
                    variant="outline"
                    className="flex items-center gap-3 text-lg px-8"
                    onClick={() =>
                        window.open("https://www.paypal.com/donate/?hosted_button_id=QDAFMYAZNTQ9L", "_self")
                    }>
                    <svg xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        fill="currentColor"
                        className="bi bi-paypal"
                        viewBox="0 0 16 16">
                        <path d="M14.06 3.713c.12-1.071-.093-1.832-.702-2.526C12.628.356 11.312 0 9.626 0H4.734a.7.7 0 0 0-.691.59L2.005 13.509a.42.42 0 0 0 .415.486h2.756l-.202 1.28a.628.628 0 0 0 .62.726H8.14c.429 0 .793-.31.862-.731l.025-.13.48-3.043.03-.164.001-.007a.35.35 0 0 1 .348-.297h.38c1.266 0 2.425-.256 3.345-.91q.57-.403.993-1.005a4.94 4.94 0 0 0 .88-2.195c.242-1.246.13-2.356-.57-3.154a2.7 2.7 0 0 0-.76-.59l-.094-.061ZM6.543 8.82a.7.7 0 0 1 .321-.079H8.3c2.82 0 5.027-1.144 5.672-4.456l.003-.016q.326.186.548.438c.546.623.679 1.535.45 2.71-.272 1.397-.866 2.307-1.663 2.874-.802.57-1.842.815-3.043.815h-.38a.87.87 0 0 0-.863.734l-.03.164-.48 3.043-.024.13-.001.004a.35.35 0 0 1-.348.296H5.595a.106.106 0 0 1-.105-.123l.208-1.32z" />
                    </svg>
                    {tl(currentLanguage, "donate.paypal_button")}
                </Button>
            </motion.div>

            <motion.section
                className="mt-16 px-6 max-w-3xl w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}>
                <h2 className="text-2xl font-semibold mb-4 text-center text-orange-400">
                    {tl(currentLanguage, "donate.donor_table_title")}
                </h2>
                <div className="overflow-x-auto bg-[#181818] border border-[#2a2a2a] rounded-xl shadow-lg">
                    <Table.Root>
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell></Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table.Root>
                </div>
                <p className="flex flex-row justify-center text-gray-500  text-xs mt-3">{tl(currentLanguage, "donate.donor_table_att")}</p>
            </motion.section>

            <footer className="mt-20 text-center text-gray-500 text-sm">
                <p>{tl(currentLanguage, "donate.footer")}</p>
            </footer>
        </main>
    );
}

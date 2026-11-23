import { Calendar, Facebook, Globe, Instagram, Mail, Shield, Youtube } from "lucide-react";

const integrations = [
  {
    name: "Gmail",
    desc: "Personal & Work inbox management",
    icon: Mail,
    color: "from-red-500/20 to-orange-500/10 border-red-500/30 text-red-400",
    status: "Ready for M6"
  },
  {
    name: "Google Calendar",
    desc: "Meeting schedules & smart reminders",
    icon: Calendar,
    color: "from-blue-500/20 to-cyan-500/10 border-blue-500/30 text-blue-400",
    status: "Ready for M6"
  },
  {
    name: "Facebook & Insta",
    desc: "Social media post creation & insights",
    icon: Facebook,
    color: "from-blue-600/20 to-indigo-500/10 border-blue-600/30 text-blue-300",
    status: "Planned M5"
  },
  {
    name: "YouTube Channel",
    desc: "Video analytics and comment responder",
    icon: Youtube,
    color: "from-rose-600/20 to-red-500/10 border-rose-600/30 text-rose-400",
    status: "Planned M5"
  }
];

export default function IntegrationHubCard() {
  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#121124] to-[#0d0b17] p-6 shadow-xl backdrop-blur-xl">
      <div className="flex items-center justify-between pb-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-400">
            <Globe size={20} />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Connected Accounts</h4>
            <p className="text-[11px] text-gray-400">Approved Platform Integrations</p>
          </div>
        </div>
        <span className="flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-1 text-[11px] text-gray-400 border border-white/10">
          <Shield size={12} className="text-emerald-400" />
          Secure Vault
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {integrations.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.name}
              className="group relative flex flex-col justify-between rounded-2xl border border-white/5 bg-white/[0.03] p-4 transition hover:border-violet-500/30 hover:bg-white/[0.06]"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-xl border bg-gradient-to-br ${item.color}`}>
                    <Icon size={17} />
                  </div>
                  <span className="text-[10px] font-medium text-gray-500 group-hover:text-violet-300 transition">
                    {item.status}
                  </span>
                </div>
                <h5 className="mt-3 text-xs font-semibold text-white">{item.name}</h5>
                <p className="mt-1 text-[11px] leading-relaxed text-gray-400">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

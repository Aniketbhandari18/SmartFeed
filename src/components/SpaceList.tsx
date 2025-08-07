import * as motion from "motion/react-client";

import { getDbUserId } from "@/lib/getDbUserId";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { BarChart3, Trash2, Link as LinkIcon, Pencil } from "lucide-react";
import CreateSpaceForm from "./CreateSpaceForm";
import CopyButton from "./CopyButton";
import UpdateSpaceForm from "./UpdateSpaceForm";

export default async function SpaceList() {
  const dbUserId = await getDbUserId();

  const spaces = await prisma.space.findMany({
    where: { createdById: dbUserId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="lg:col-span-2"
      >
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Your Spaces</h2>
            <p className="text-gray-600 mt-1">
              Manage your testimonial collection spaces
            </p>
          </div>

          <div className="p-6">
            {spaces && spaces.length > 0 ? (
              <div className="space-y-4">
                {spaces.map((space, index) => (
                  <motion.div
                    key={space.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
                    viewport={{ once: true }}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-200 hover:bg-blue-50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="min-w-20">
                        <Link href={`/spaces/${space.slug}`}>
                          <h3 className="inline text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
                            {space.name}
                          </h3>
                        </Link>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {space.description}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{spaces.length || 0} feedbacks</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 ml-4 shrink-0">
                        {/* Copy feedback submission page link button */}
                        <CopyButton value={`${process.env.NEXT_PUBLIC_APP_URL}/submit/${space.slug}`}>
                          <button
                            title="Copy Submission Link"
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                          >
                            <LinkIcon size={18} />
                          </button>
                        </CopyButton>
                        {/* Edit button */}
                        <UpdateSpaceForm space={space}>
                          <button
                            title="Edit Space"
                            className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors cursor-pointer"
                          >
                            <Pencil size={18} />
                          </button>
                        </UpdateSpaceForm>

                        {/* Delete button */}
                        <button
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                          title="Delete Space"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BarChart3 className="mx-auto text-gray-400 mb-4" size={48} />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No spaces yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Create your first space to get started
                </p>
                <CreateSpaceForm />
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
